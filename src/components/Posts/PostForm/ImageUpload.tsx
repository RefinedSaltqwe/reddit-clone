import { Button, Flex, Stack, Image } from '@chakra-ui/react';
import React, { useRef } from 'react';

type ImageUploadProps = {
    selectedFile?: string; //? means it is optional
    setSelectedFile: (value: string) => void;
    setSelectedTab: (value: string) => void;
    onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const ImageUpload:React.FC<ImageUploadProps> = ({
    selectedFile,
    setSelectedFile,
    setSelectedTab,
    onSelectImage,
}) => {

    const selectedFileRef = useRef<HTMLInputElement>(null);
    
    return (
        <Flex direction="column" justify="center" align="center" width="100%">
            
          {selectedFile ? (
            <>
              <Image
                src={selectedFile as string}
                maxWidth="400px"
                maxHeight="400px"
              />
              <Stack direction="row" mt={4}>
                <Button height="28px" onClick={() => setSelectedTab("Post")}>
                  Back to Post
                </Button>
                <Button
                  variant="outline"
                  height="28px"
                  onClick={() => setSelectedFile("")}
                >
                  Remove
                </Button>
              </Stack>
            </>
          ) : (
            <Flex
              justify="center"
              align="center"
              p={20}
              border="1px dashed"
              borderColor="gray.200"
              borderRadius={4}
              width="100%"
            >
              <Button
                variant="outline"
                height="28px"
                onClick={() => selectedFileRef.current?.click()}
              >
                Upload
              </Button>
              <input
                id="file-upload"
                type="file"
                accept="image/x-png,image/gif,image/jpeg"
                hidden
                ref={selectedFileRef}
                onChange={onSelectImage}
              />
            </Flex>
          )}
        </Flex>
      );
}
export default ImageUpload;