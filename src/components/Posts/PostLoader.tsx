import React from "react";
import { Stack, Box, SkeletonText, Skeleton, Flex } from "@chakra-ui/react";

const PostLoader: React.FC = () => {
  return (
    <Stack spacing={6}>
      <Box padding="10px 10px" boxShadow="lg" bg="white" borderRadius={4}>
        <SkeletonText mt="4" noOfLines={1} width="40%" spacing="4" />
        <SkeletonText mt="4" noOfLines={4} spacing="4" />
        <Skeleton mt="4" height="200px" />
        <Flex direction="row">
            <Skeleton mt="4"  height="20px" width="7%" />
            <Skeleton mt="4" ml={2} height="20px" width="14%" />
            <Skeleton mt="4" ml={2} height="20px" width="12%" />
            <Skeleton mt="4" ml={2} height="20px" width="17%" />
        </Flex>
        
      </Box>
      <Box padding="10px 10px" boxShadow="lg" bg="white" borderRadius={4}>
        <SkeletonText mt="4" noOfLines={1} width="40%" spacing="4" />
        <SkeletonText mt="4" noOfLines={4} spacing="4" />
        <Skeleton mt="4" height="200px" />
        <Flex direction="row">
            <Skeleton mt="4"  height="20px" width="7%" />
            <Skeleton mt="4" ml={2} height="20px" width="14%" />
            <Skeleton mt="4" ml={2} height="20px" width="12%" />
            <Skeleton mt="4" ml={2} height="20px" width="17%" />
        </Flex>
      </Box>
      <Box padding="10px 10px" boxShadow="lg" bg="white" borderRadius={4}>
        <SkeletonText mt="4" noOfLines={1} width="40%" spacing="4" />
        <SkeletonText mt="4" noOfLines={4} spacing="4" />
        <Skeleton mt="4" height="200px" />
        <Flex direction="row">
            <Skeleton mt="4"  height="20px" width="7%" />
            <Skeleton mt="4" ml={2} height="20px" width="14%" />
            <Skeleton mt="4" ml={2} height="20px" width="12%" />
            <Skeleton mt="4" ml={2} height="20px" width="17%" />
        </Flex>
      </Box>
    </Stack>
  );
};
export default PostLoader;
