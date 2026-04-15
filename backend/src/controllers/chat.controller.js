const { asyncHandler, apiResponse } = require("../utils/helpers");
const llmService = require("../services/llm.service");

const postChat = asyncHandler(async (req, res) => {
  const chatResponse = await llmService.askChatbot(req.body);
  return apiResponse(res, chatResponse, "Chat response generated");
});

module.exports = {
  postChat
};
