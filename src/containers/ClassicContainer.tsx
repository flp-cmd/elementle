import ClassicContent from "@/components/classic/ClassicContent";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { Flex } from "@mantine/core";

export default function ClassicContainer() {
  return (
    <Flex
      direction={"column"}
      justify={"space-between"}
      align={"center"}
      h={"100vh"}
      px={"60px"}
      py={"100px"}
    >
      <Header />
      <ClassicContent />
      <Footer />
    </Flex>
  );
}
