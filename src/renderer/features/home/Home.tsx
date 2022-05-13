import { Image, Typography } from 'antd';
import mainImage from '@assets/icon.png';
import { Flex } from '@src/renderer/components/styledComponents';

export default function Home() {
  return (
    <Flex>
      <Typography.Title level={2}>DOS GANG HAS ARRIVED!</Typography.Title>
      <Image src={mainImage} width={480} height={480} />
    </Flex>
  );
}
