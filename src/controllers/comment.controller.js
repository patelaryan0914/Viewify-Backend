import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;
  const userId = req.user?._id;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "VideoId is missing or corrupted");
  }
  const comment = await Comment.create({
    content,
    video: videoId,
    owner: userId,
  });
  if (!comment) {
    throw new ApiError(400, "Something Went Wrong While Commenting");
  }

  return res.status(200).json(new ApiResponse(200, "Comment Created"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { updatedContent } = req.body;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Comment Id is missing or corrupted");
  }
  const updatedComment = await Comment.findByIdAndUpdate(commentId, {
    $set: { content: updatedContent },
  });
  if (!updatedComment) {
    throw new ApiError(400, "Something Went Wrong While Updating Comment");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Comment Updated Succesfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Comment Id is missing or corrupted");
  }
  const deletedComment = await Comment.findByIdAndDelete(commentId);
  if (!deletedComment) {
    throw new ApiError(400, "Something Went Wrong While Deleting Comment");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Comment Deleted Succesfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
