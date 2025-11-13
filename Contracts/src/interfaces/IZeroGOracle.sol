// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IZeroGOracle
 * @notice Interface for 0G decentralized AI oracle
 * @dev Used to request AI inference and retrieve results
 */
interface IZeroGOracle {
    /**
     * @notice Request AI inference from 0G network
     * @param modelId The ID of the AI model to use
     * @param input Encoded input data for the model
     * @return requestId Unique identifier for this inference request
     */
    function requestInference(
        uint256 modelId,
        bytes calldata input
    ) external payable returns (uint256 requestId);
    
    /**
     * @notice Get the result of a completed inference request
     * @param requestId The request ID to query
     * @return fulfilled Whether the request has been fulfilled
     * @return output The AI model's output (empty if not fulfilled)
     */
    function getInferenceResult(
        uint256 requestId
    ) external view returns (bool fulfilled, bytes memory output);
    
    /**
     * @notice Get the status of an inference request
     * @param requestId The request ID to query
     * @return status 0=pending, 1=fulfilled, 2=failed
     */
    function getRequestStatus(
        uint256 requestId
    ) external view returns (uint8 status);
}