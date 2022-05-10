import { Image, Typography } from 'antd';
import { Flex } from 'renderer/components/styledComponents';
import mainImage from 'assets/icon.png';

export default function Home() {
  return (
    <Flex>
      <Typography.Title level={2}>DOS GANG HAS ARRIVED!</Typography.Title>
      <Image src={mainImage} width={480} height={480} />
    </Flex>
  );
}
