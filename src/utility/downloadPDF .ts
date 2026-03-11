import { showToast } from "components/Toaster";

// utils/downloadFile.ts
export const downloadFile = async (
  url: string,
  fileName: string = "report.zip",
  params: Record<string, any> = {},
  token?: string
): Promise<void> => {
  try {
    const query = new URLSearchParams(
      Object.entries(params).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null) acc[key] = String(value);
          return acc;
        },
        {} as Record<string, string>
      )
    ).toString();
    console.log("Download URL:", `${url}?${query}`);
    const response = await fetch(`${url}`, {
      method: "GET",
      headers: {
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      showToast("File download failed.", "error");
      throw new Error("File download failed.");
    }

    const blob = await response.blob();
    const href = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(href);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};
