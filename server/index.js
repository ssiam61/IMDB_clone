const express = require("express");
const app = express();

app.use(express.json());

const cors = require("cors");
app.use(cors());
const { authMiddleware } = require("./middleware/auth");

const queryRoutes = require("./routes/queries");
app.use("/api", queryRoutes);
app.use("/api/auth", require("./routes/auth"));
app.use("/users", authMiddleware, require("./routes/users"));
app.use("/admin", authMiddleware, require("./routes/admin"));
app.use("/admin_log", authMiddleware, require("./routes/admin_log"));
app.use("/user_ban", authMiddleware, require("./routes/user_ban"));
app.use("/report", authMiddleware, require("./routes/report"));

app.use("/genre", authMiddleware, require("./routes/genre"));
app.use("/preference", authMiddleware, require("./routes/preference"));
app.use("/person", authMiddleware, require("./routes/person"));

app.use("/award", authMiddleware, require("./routes/award"));
app.use("/person_award", authMiddleware, require("./routes/person_award"));

app.use("/media", authMiddleware, require("./routes/media"));
app.use("/movie", authMiddleware, require("./routes/movie"));
app.use("/series", authMiddleware, require("./routes/series"));
app.use("/season", authMiddleware, require("./routes/season"));
app.use("/episode", authMiddleware, require("./routes/episode"));

app.use("/media_genre", authMiddleware, require("./routes/media_genre"));
app.use("/media_personality", authMiddleware, require("./routes/media_personality"));
app.use("/media_award", authMiddleware, require("./routes/media_award"));

app.use("/review", authMiddleware, require("./routes/review"));
app.use("/reply", authMiddleware, require("./routes/reply"));
app.use("/watchlist", authMiddleware, require("./routes/watchlist"));
app.use("/post_attachments", authMiddleware, require("./routes/post_attachments"));
app.use("/reply_attachments", authMiddleware, require("./routes/reply_attachments"));

app.listen(5000, () => {
  console.log("server running on port 5000");
});