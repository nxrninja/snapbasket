(function () {
  class DevLoad {
    constructor(apiKey) {
      this.apiKey = apiKey;

      // Make sure axios is ready (DevLoad.ready ensures this)
      if (!window.axios) {
        throw new Error("Axios not loaded yet. Use DevLoad.ready.then(() => new DevLoad(apiKey))");
      }

      this.client = window.axios.create({
        baseURL: "https://api-devload.cloudcoderhub.in",
        headers: {
          "x-api-key": this.apiKey,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
    }

    async uploadFile(projectId, file) {
      const form = new FormData();
      form.append("file", file);

      try {
        const response = await this.client.post(
          `/api/v1/devload/projects/${projectId}/upload`,
          form,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        return response.data;
      } catch (error) {
        const msg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Upload failed";

        console.error("Error uploading file:", msg);
        throw new Error(msg);
      }
    }

    async deleteFile(fileId) {
      try {
        const response = await this.client.delete(
          `/api/v1/devload/delete/${fileId}`
        );
        return response.data;
      } catch (error) {
        const msg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Delete failed";

        console.error("Error deleting file:", msg);
        throw new Error(msg);
      }
    }
  }

  // Expose class to window
  window.DevLoad = DevLoad;

  // Provide a ready Promise that guarantees axios is loaded
  window.DevLoad.ready = new Promise((resolve, reject) => {
    // If axios already exist, resolve immediately
    if (window.axios) return resolve();

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Axios for DevLoad"));
    document.head.appendChild(script);
  });
})();
