import { Box, Text } from "@mantine/core";

export default function Header() {
  return (
    <Box>
      <Text
        fw={"900"}
        c={"#fff"}
        ta={"center"}
        style={{ fontSize: "clamp(32px, 6vw, 52px)" }}
      >
        Elementle
      </Text>
    </Box>
  );
}
