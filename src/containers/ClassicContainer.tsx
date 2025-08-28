import ClassicContent from "@/components/classic/ClassicContent";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { Flex } from "@mantine/core";

export default function ClassicContainer() {
  return (
    <Flex
      direction={"column"}
      align={"center"}
      mih={"100vh"}
      px={{ base: "10px", md: "60px" }}
      py={"40px"}
      justify={"space-between"}
      maw={"1200px"}
      mx={"auto"}
      w={"100%"}
    >
      <Flex
        direction={"column"}
        align={"center"}
        gap={"10px"}
      >
        <Header />
        <ClassicContent />
      </Flex>
      <Footer />
    </Flex>
  );
}
