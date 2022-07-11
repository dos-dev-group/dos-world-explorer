import { Image, Typography } from 'antd';
import mainImage from '@assets/icon.png';
import dosGangImage from '@assets/dos_gang.svg';
import { Flex } from '@src/renderer/components/styledComponents';

export default function Home() {
  return (
    <Flex>
      <Typography.Title level={2}>Welcome to VRCExplorer</Typography.Title>
      <Image src={mainImage} width={480} height={480} />
    </Flex>
  );
}
