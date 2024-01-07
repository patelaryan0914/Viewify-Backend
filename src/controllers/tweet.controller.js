import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;
  const userId = req.user._id;

  const tweet = await Tweet.create({
    content,
    owner: userId,
  });

  if (!tweet) {
    return new ApiError(500, "Something Went Wrong While Creating Tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Tweet created Succesfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;

  if (!userId || userId.length !== 24) {
    throw new ApiError(400, "UserID is missing or corrupted");
  }

  const userTweets = await Tweet.find({ owner: userId });

  if (!userTweets) {
    throw new ApiError(500, "Something Went Wrong While Fetching Tweets");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, userTweets, "User Tweets Fetched Successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!tweetId || tweetId.length !== 24) {
    throw new ApiError(400, "TweetId is missing or corrupted");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  if (!updatedTweet) {
    throw new ApiError(400, "Something Wnet Wrong While Updating Tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Tweet Updated Successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  if (!tweetId || tweetId.length !== 24) {
    throw new ApiError(400, "TweetId is missing or corrupted");
  }

  const deletedTweet = await Tweet.findOneAndDelete({ _id: tweetId });

  if (!deletedTweet) {
    throw new ApiError(400, "Something Went Wrong Tweet not Deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Tweet Deleted Successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
