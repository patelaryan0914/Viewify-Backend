import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  //TODO: create playlist
  const userID = req.user?._id;
  const playlist = await Playlist.create({
    name,
    description,
    videos: [],
    owner: userID,
  });
  if (!playlist) {
    throw new ApiError(400, "Something Went Wrong While Creating Playlist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Playlist created Successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "UserId is missing or corrupted");
  }
  const playlist = await Playlist.find({ owner: userId });
  if (!playlist) {
    throw new ApiError(400, "Something Wrong While fetching Playlist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched Successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "PlaylistId is missing or corrupted");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, "Something Wrong While fetching Playlist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched Successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  //TODO: Add Video to playlist
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "PlaylistId is missing or corrupted");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "VideoId is missing or corrupted");
  }
  const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
    $push: { videos: videoId },
  });
  if (!updatedPlaylist) {
    throw new ApiError(400, "Something Went Wrong While Updating Playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Playlist Updated Successfull"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "PlaylistId is missing or corrupted");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "VideoId is missing or corrupted");
  }
  const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
    $pull: { videos: videoId },
  });
  if (!updatedPlaylist) {
    throw new ApiError(400, "Something Went Wrong While Updating Playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Playlist Updated Successfull"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "PlaylistId is missing or corrupted");
  }
  const deletePlaylist = await Playlist.findByIdAndDelete(playlistId);
  if (!deletePlaylist) {
    throw new ApiError(400, "Something Went Wrong While deleting Playlist");
  }
  return res.status(200).json(new ApiResponse(200, "Playlist is Deleted"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "PlaylistId is missing or corrupted");
  }
  const updatePlaylistDetails = await Playlist.findByIdAndUpdate(playlistId, {
    $set: { name, description },
  });
  if (!updatePlaylistDetails) {
    throw new ApiError(400, "Something Went Wrong While Updating Detials");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Details Updated Successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
