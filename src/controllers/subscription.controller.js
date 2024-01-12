import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user?._id;
  // TODO: toggle subscription
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Channel Id is missing or corrupted");
  }
  const toogleSubscription = await Subscription.create({
    subscriber: userId,
    channel: channelId,
  });
  if (!toogleSubscription) {
    throw new ApiError(
      400,
      "Something Went Wrong While Subscribing the channel"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Channel Subscribed Susscessfully"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Channel Id is missing or corrupted");
  }
  const subscriberList = await Subscription.aggregate([
    { $match: { channel: new mongoose.Types.ObjectId(channelId) } },
    {
      $group: {
        _id: "$subscriber",
      },
    },
    {
      $group: {
        _id: null,
        subscribers: { $push: { subscriber: "$_id" } },
        totalSubscribers: { $sum: 1 },
      },
    },
  ]);
  if (!subscriberList) {
    throw new ApiError(400, "Something Went Wrong While Fetching The List");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscriberList,
        "Subscriber List Fetched Succesfully"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Channel Id is missing or corrupted");
  }
  const channelList = await Subscription.aggregate([
    { $match: { subscriber: new mongoose.Types.ObjectId(subscriberId) } },
    {
      $group: {
        _id: "$channel",
      },
    },
    {
      $group: {
        _id: null,
        channels: { $push: { channel: "$_id" } },
        totalChannels: { $sum: 1 },
      },
    },
  ]);
  if (!channelList) {
    throw new ApiError(400, "Something Went Wrong While Fetching The List");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, channelList, "Channel List Fetched Succesfully")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
