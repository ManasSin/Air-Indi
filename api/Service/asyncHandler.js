export const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    const isOperationalError =
      error instanceof Error &&
      error.name !== "ValidationError" &&
      error.name !== "CastError";

    if (isOperationalError) {
      console.error("Operational error:", error);
      return res
        .status(500)
        .send("Something went wrong. Please try again later.");
    } else {
      console.error("Error:", error);
      return res.status(500).send("An unexpected error occurred.");
    }
  }
};
