import { Image, Typography } from 'antd';
import { Flex } from 'renderer/components/styledComponents';
import mainImage from 'assets/main-test.png';

export default function Home() {
  return (
    <Flex>
      <Typography.Title level={2}>여기는 도스갱이 점령한닷!</Typography.Title>
      <Image src={mainImage} />
    </Flex>
  );
}
