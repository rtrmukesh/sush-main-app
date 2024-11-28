class Media {
  static isImage(fileName) {
    if (fileName) {
      const ext = fileName.split(".").pop().toLowerCase();
      if (ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "gif") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  static isVideo(fileName) {
    if (fileName) {
      const ext = fileName.split(".").pop().toLowerCase();
      if (ext === "mp4" || ext === "mkv" || ext === "avi" || ext === "mov") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
export default Media;
