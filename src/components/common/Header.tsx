import { Box, Image } from "@mantine/core";

export default function Header() {
  return (
    <Box maw={"450px"} w={"100%"}>
      <Image src={"/elementle-logo.png"} alt="Elementle Logo" />
    </Box>
  );
}
