import React, { useState } from "react";

const useSelectFile = () => {
  const [selectedFile, setSelectedFile] = useState<string>();//Image Input
  const [isSave, setIsSave] = useState(false);//Image Input

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("THIS IS HAPPENING", event);

    const reader = new FileReader();
    if (event.target.files?.[0]) {
        reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
    if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target?.result as string); // SETS the Image
        setIsSave(true);
    }
    };
  };

  return {
    selectedFile,
    setSelectedFile,
    onSelectFile,
    setIsSave,
    isSave
  };
};
export default useSelectFile;
