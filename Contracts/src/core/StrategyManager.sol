// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

/**
 * @title StrategyManager
 * @notice Manages strategy allocations with optional AI-driven optimization
 */
contract StrategyManager is Ownable, AccessControl, ReentrancyGuard, EIP712 {
    using ECDSA for bytes32;

    // ============ CORE STRUCTS ============
    
    struct StrategyInfo {
        address strategy;
        uint256 allocation; // Basis points (10000 = 100%)
        bool active;
    }
    
    struct AIRecommendation {
        address manager;
        uint256 nonce;
        uint256 deadline;
        uint256[] indices;
        uint256[] allocations;
        uint256 timestamp;
        string modelVersion;
        uint256 confidence; // 1e18 = 100%
    }

    // ============ STATE ============
    
    StrategyInfo[] public strategies;
    address public vault;
    
    // AI roles
    bytes32 public constant AI_AGENT = keccak256("AI_AGENT");
    bytes32 public constant KEEPER = keccak256("KEEPER");
    
    // AI state
    mapping(address => uint256) public agentNonce;
    AIRecommendation public pending;
    bool public hasPending;
    uint256 public lastAIRebalance;
    
    // Safety limits (basis points)
    uint256 public maxSingle = 4000;      // 40%
    uint256 public maxShift = 2000;       // 20%
    uint256 public minConfidence = 7000;  // 70%
    uint256 public cooldown = 6 hours;
    
    // ============ EVENTS ============
    
    event StrategyAdded(address indexed strategy, uint256 allocation);
    event StrategyRemoved(address indexed strategy, uint256 index);
    event AllocationUpdated(uint256 indexed index, uint256 newAllocation);
    event VaultSet(address indexed vault);
    event AISubmitted(address indexed agent, uint256 nonce, uint256 confidence);
    event AIExecuted(address indexed keeper, uint256 timestamp);
    
    // ============ MODIFIERS ============
    
    modifier onlyVault() {
        require(msg.sender == vault, "Only vault");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    constructor() Ownable(msg.sender) EIP712("StrategyManager", "1") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // ============ MANUAL FUNCTIONS ============
    
    function setVault(address _vault) external onlyOwner {
        require(_vault != address(0), "Invalid vault");
        vault = _vault;
        emit VaultSet(_vault);
    }

    function addStrategy(address _strategy, uint256 _allocation) external onlyOwner {
        require(_strategy != address(0), "Invalid strategy");
        require(_allocation <= 10000, "Allocation too high");
        
        uint256 total = _allocation;
        for (uint256 i = 0; i < strategies.length; i++) {
            if (strategies[i].active) total += strategies[i].allocation;
        }
        require(total <= 10000, "Total > 100%");
        
        strategies.push(StrategyInfo(_strategy, _allocation, true));
        emit StrategyAdded(_strategy, _allocation);
    }
    
    function removeStrategy(uint256 index) external onlyOwner {
        require(index < strategies.length, "Invalid index");
        strategies[index].active = false;
        strategies[index].allocation = 0;
        emit StrategyRemoved(strategies[index].strategy, index);
    }
    
    function updateAllocation(uint256 index, uint256 newAlloc) external onlyOwner {
        require(index < strategies.length, "Invalid index");
        require(newAlloc <= 10000, "Too high");
        require(strategies[index].active, "Not active");
        
        uint256 total = newAlloc;
        for (uint256 i = 0; i < strategies.length; i++) {
            if (i != index && strategies[i].active) {
                total += strategies[i].allocation;
            }
        }
        require(total <= 10000, "Total > 100%");
        
        strategies[index].allocation = newAlloc;
        emit AllocationUpdated(index, newAlloc);
    }
    
    // ============ VIEW FUNCTIONS ============
    
    function getStrategyCount() external view returns (uint256) {
        return strategies.length;
    }
    
    function getStrategy(uint256 index) external view returns (
        address strategy, 
        uint256 allocation, 
        bool active
    ) {
        require(index < strategies.length, "Invalid index");
        StrategyInfo memory s = strategies[index];
        return (s.strategy, s.allocation, s.active);
    }

    function getActiveStrategies() external view returns (StrategyInfo[] memory) {
        uint256 count;
        for (uint256 i = 0; i < strategies.length; i++) {
            if (strategies[i].active) count++;
        }
        
        StrategyInfo[] memory active = new StrategyInfo[](count);
        uint256 idx;
        for (uint256 i = 0; i < strategies.length; i++) {
            if (strategies[i].active) {
                active[idx++] = strategies[i];
            }
        }
        return active;
    }

    function getTotalAllocation() external view returns (uint256) {
        uint256 total;
        for (uint256 i = 0; i < strategies.length; i++) {
            if (strategies[i].active) total += strategies[i].allocation;
        }
        return total;
    }

    // ============ AI FUNCTIONS ============

    function submitAI(
        AIRecommendation calldata rec,
        bytes calldata sig
    ) external nonReentrant {
        require(rec.deadline >= block.timestamp, "Expired");
        require(rec.manager == address(this), "Wrong manager");
        require(rec.indices.length == rec.allocations.length, "Length mismatch");
        require(rec.indices.length > 0, "Empty");

        // Verify signature
        bytes32 hash = keccak256(abi.encode(
            keccak256("AIRecommendation(address manager,uint256 nonce,uint256 deadline,uint256[] indices,uint256[] allocations,uint256 timestamp,string modelVersion,uint256 confidence)"),
            rec.manager,
            rec.nonce,
            rec.deadline,
            keccak256(abi.encodePacked(rec.indices)),
            keccak256(abi.encodePacked(rec.allocations)),
            rec.timestamp,
            keccak256(bytes(rec.modelVersion)),
            rec.confidence
        ));
        
        address signer = _hashTypedDataV4(hash).recover(sig);
        require(hasRole(AI_AGENT, signer), "Not agent");
        require(rec.nonce == agentNonce[signer], "Bad nonce");

        // Validate allocations
        uint256 total;
        for (uint256 i = 0; i < rec.allocations.length; i++) {
            total += rec.allocations[i];
        }
        require(total >= 9900 && total <= 10100, "Must sum to 10000");

        // Check safety
        uint256 confBps = (rec.confidence * 10000) / 1e18;
        require(confBps >= minConfidence, "Low confidence");

        for (uint256 i = 0; i < rec.indices.length; i++) {
            uint256 idx = rec.indices[i];
            require(idx < strategies.length, "Invalid index");
            require(strategies[idx].active, "Not active");
            require(rec.allocations[i] <= maxSingle, "Too high");

            uint256 shift = rec.allocations[i] > strategies[idx].allocation
                ? rec.allocations[i] - strategies[idx].allocation
                : strategies[idx].allocation - rec.allocations[i];
            require(shift <= maxShift, "Shift too large");
        }

        agentNonce[signer]++;
        pending = rec;
        hasPending = true;

        emit AISubmitted(signer, rec.nonce, rec.confidence);
    }

    function executeAI() external onlyRole(KEEPER) nonReentrant {
        require(hasPending, "No pending");
        require(block.timestamp >= lastAIRebalance + cooldown, "Cooldown");

        AIRecommendation memory rec = pending;

        for (uint256 i = 0; i < rec.indices.length; i++) {
            strategies[rec.indices[i]].allocation = rec.allocations[i];
            emit AllocationUpdated(rec.indices[i], rec.allocations[i]);
        }

        lastAIRebalance = block.timestamp;
        hasPending = false;

        emit AIExecuted(msg.sender, block.timestamp);
    }

    // ============ ADMIN ============

    function setSafety(
        uint256 _maxSingle,
        uint256 _maxShift,
        uint256 _minConf,
        uint256 _cooldown
    ) external onlyOwner {
        maxSingle = _maxSingle;
        maxShift = _maxShift;
        minConfidence = _minConf;
        cooldown = _cooldown;
    }

    function addAgent(address agent) external onlyOwner {
        grantRole(AI_AGENT, agent);
    }

    function addKeeper(address keeper) external onlyOwner {
        grantRole(KEEPER, keeper);
    }

    function getAgentNonce(address agent) external view returns (uint256) {
        return agentNonce[agent];
    }

    function getDomainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }
}