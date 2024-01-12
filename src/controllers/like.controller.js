import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleLike = asyncHandler(async (req, res, type) => {
  try {
    const { userId } = req.user?._id; // Assuming you have the user information in the request

    let likedItem;

    switch (type) {
      case "video":
        likedItem = await Like.findOne({
          video: req.params.videoId,
          likedBy: userId,
        });

        if (likedItem) {
          // User has already liked the video, remove the like (dislike)
          await Like.findOneAndDelete({
            video: req.params.videoId,
            likedBy: userId,
          });
          return res.json(new ApiResponse(200, "Disliked successfully", null));
        } else {
          // User has not liked the video, add a new like
          likedItem = await Like.create({
            video: req.params.videoId,
            likedBy: userId,
          });
        }
        break;
      case "comment":
        // Similar logic for comments
        likedItem = await Like.findOne({
          comment: req.params.commentId,
          likedBy: userId,
        });

        if (likedItem) {
          // User has already liked the video, remove the like (dislike)
          await Like.findOneAndDelete({
            comment: req.params.commentId,
            likedBy: userId,
          });
          return res.json(new ApiResponse(200, "Disliked successfully", null));
        } else {
          // User has not liked the video, add a new like
          likedItem = await Like.create({
            comment: req.params.commentId,
            likedBy: userId,
          });
        }
        break;
      case "tweet":
        // Similar logic for tweets
        likedItem = await Like.findOne({
          tweet: req.params.tweetId,
          likedBy: userId,
        });

        if (likedItem) {
          // User has already liked the video, remove the like (dislike)
          await Like.findOneAndDelete({
            tweet: req.params.tweetId,
            likedBy: userId,
          });
          return res.json(new ApiResponse(200, "Disliked successfully", null));
        } else {
          // User has not liked the video, add a new like
          likedItem = await Like.create({
            tweet: req.params.tweetId,
            likedBy: userId,
          });
        }
        break;
      default:
        throw new ApiError(400, "Invalid like type");
    }

    return res.json(
      new ApiResponse(200, "Toggle like/dislike successful", likedItem)
    );
  } catch (error) {
    console.log(error);
  }
});

const toggleVideoLike = asyncHandler(async (req, res) => {
  await toggleLike(req, res, "video");
  //TODO: toggle like on video
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  await toggleLike(req, res, "comment");
  //TODO: toggle like on comment
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  await toggleLike(req, res, "tweet");
  //TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const { userId } = req.user;

  const likedVideos = await Like.find({
    likedBy: userId,
    video: { $exists: true },
  });

  return res.json(
    new ApiResponse(200, "Liked videos retrieved successfully", likedVideos)
  );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
