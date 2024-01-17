import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  const ownerId = req.user._id;
  const videolocalpath = req.files.videoFile[0]?.path;
  if (!videolocalpath) {
    throw new ApiError(400, "Video file is required");
  }
  const video = await uploadOnCloudinary(videolocalpath);
  if (!video) {
    throw new ApiError(400, "Video file is required");
  }
  const thumbnaillocalpath = req.files.thumbnail[0]?.path;
  if (!thumbnaillocalpath) {
    throw new ApiError(400, "Thumbnail file is required");
  }
  const thumbnail = await uploadOnCloudinary(thumbnaillocalpath);
  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail file is required");
  }
  const videoUpload = await Video.create({
    videoFile: { url: video?.url, public_id: video?.public_id },
    thumbnail: { thumbnail: thumbnail?.url, public_id: thumbnail?.public_id },
    owner: ownerId,
    title,
    description,
    duration: video?.duration,
    views: 0,
    isPublished: false,
  });
  if (!videoUpload) {
    throw new ApiError(500, "Something Went Wrong While uploading Video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videoUpload, "Video Uploaded Successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (!videoId || videoId.length !== 24) {
    throw new ApiError(400, "VideoId is missing or corrupted");
  }
  const getVideo = await Video.findById(videoId);
  if (!getVideo) {
    throw new ApiError(500, "Something Went Wrong While Fetching Video");
  }
  const updateView = await Video.findByIdAndUpdate(videoId, {
    $set: { views: getVideo.views + 1 },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, updateView, "Video Fetched Succesfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description } = req.body;
    //TODO: update video details like title, description, thumbnail
    if (!videoId || videoId.length !== 24) {
      throw new ApiError(400, "VideoId is missing or corrupted");
    }
    const thumbnaillocalpath = req.file.path;
    if (!thumbnaillocalpath) {
      throw new ApiError(400, "Thumbnail file is required");
    }
    const thumbnail = await uploadOnCloudinary(thumbnaillocalpath);
    if (!thumbnail) {
      throw new ApiError(400, "Thumbnail file is required");
    }
    const updateVideo = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: { title, description, thumbnail: thumbnail?.url },
      },
      { new: true }
    );
    if (!updateVideo) {
      throw new ApiError(400, "Something Went Wrong While Updating Details");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Video Details Updated succesfully"));
  } catch (error) {
    console.log(error);
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!videoId || videoId.length !== 24) {
    throw new ApiError(400, "VideoId is missing or corrupted");
  }

  const deleteVideo = await Video.findByIdAndDelete(videoId);

  if (!deleteVideo) {
    throw new ApiError(400, "Something Wnet Wrong Video Not Deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Video Deleted SuccessFully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || videoId.length !== 24) {
    throw new ApiError(400, "VideoId is missing or corrupted");
  }
  const findDoc = await Video.findById(videoId);
  const togglePublish = await Video.findByIdAndUpdate(videoId, {
    $set: { isPublished: !findDoc.isPublished },
  });

  if (!togglePublish) {
    throw new ApiError(400, "Something Went Wrong While Toggle Publish");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Toggle Publish operation is succesfull"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
