import { useState, useEffect } from "react";
import { ImageService } from "@/api/axios";

export const useBase64Image = (url?: string) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!url) return setLoading(false)
    const fetchData = async () => {
      const result = await ImageService.fetchImageAsDataUrl(url)
      setDataUrl(result)
      setLoading(false)
    }
    fetchData()
  }, [url])

  return { dataUrl, loading }
}
