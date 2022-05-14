import { StarFilled } from '@ant-design/icons';
import { Button, Table, Tabs, Tag } from 'antd';
import { PresetColorTypes } from 'antd/lib/_util/colors';
import { useNavigate, useParams } from 'react-router-dom';
import { Flex, FlexRow } from '@src/renderer/components/styledComponents';
import openExternalLink from '@src/renderer/utils/ipc/openExternalLink';
import simpleStringHash from '@src/renderer/utils/simpleStringHash';
import { spacing } from '@src/renderer/utils/styling';

const { TabPane } = Tabs;

export default function Favorite() {
  const params = useParams();
  const navigate = useNavigate();
  const currentType = params.type || '일반';

  const renderWorldList = (type: string) => {
    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        scroll={{
          x: true,
        }}
      />
    );
  };

  return (
    <Flex css={{ paddingLeft: spacing(1), paddingRight: spacing(1) }}>
      <Tabs
        activeKey={currentType}
        onChange={(key) => {
          navigate('/world/' + key);
        }}
      >
        <TabPane tab="일반" key="일반" />
        <TabPane tab="풍경" key="풍경" />
        <TabPane tab="사이코" key="사이코" />
      </Tabs>
      {params.type}
      {renderWorldList(currentType)}
    </Flex>
  );
}

const dataSource = [
  {
    key: '1',
    name: 'Wind Farm',
    author: 'ᴹᴼᴬᴺ',
    description: '적적한 옥상, 불어오는 바람 멋지다.',
    tags: ['풍력발전기', '바다', '풍경', '비'],
    score: 4,
    url: 'https://vrchat.com/home/world/wrld_59f64333-85ad-4409-aa42-334a38aaff0a',
  },
  {
    key: '2',
    name: '開かずの踏切-Yuyake City-',
    author: 'fley',
    description: '석양이지는 마을 풍경',
    tags: ['마을', '일본', '석양', '건널목'],
    score: 4,
    url: 'https://vrchat.com/home/world/wrld_096413e6-3de2-4f6b-93cd-0072f030743f',
  },
  {
    key: '3',
    name: 'エルフの森 ElfForest TreeHouse',
    author: 'Nekoro',
    description: '엘프의 숲, 나무집 이라는 이름에 걸맞게 아름답다.',
    tags: ['트리하우스', '풍경', '숲', '영상', '강', '집라인'],
    score: 5,
    url: 'https://vrchat.com/home/world/wrld_e58a10a8-5140-4286-a270-1cc4fc05a2a7',
  },
];

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Author',
    dataIndex: 'author',
  },
  {
    title: 'Description',
    dataIndex: 'description',
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    render: (tags: any[]) => (
      <>
        {tags.map((tag) => {
          const colorIndex = simpleStringHash(tag) % PresetColorTypes.length;
          const color = PresetColorTypes[colorIndex];
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'URL',
    dataIndex: 'url',
    render: (url: string) => (
      <Button
        type="link"
        onClick={() => openExternalLink(url)}
        css={{ whiteSpace: 'normal' }}
      >
        {url}
      </Button>
    ),
  },
  {
    title: '별점',
    dataIndex: 'score',
    render: (score: number) => (
      <FlexRow>
        {new Array(score).fill(null).map((_, index) => (
          <StarFilled key={index} />
        ))}
      </FlexRow>
    ),
  },
];
