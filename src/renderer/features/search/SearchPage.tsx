import { ReloadOutlined, StarFilled } from '@ant-design/icons';
import {
  Button,
  Image,
  Input,
  Popconfirm,
  Select,
  Spin,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import { PresetColorTypes } from 'antd/lib/_util/colors';
import { Flex, FlexRow } from '@src/renderer/components/styledComponents';
import simpleStringHash from '@src/renderer/utils/simpleStringHash';
import { spacing } from '@src/renderer/utils/styling';
import { World, WorldSortOrder } from '@src/types';
import useSearchPage from './hooks/useSearchPage';
import AddWorldModal from './AddWorldModal';

const { TabPane } = Tabs;
const { Column } = Table;
const { Option } = Select;
const { Search } = Input;

export default function SearchPage() {
  const hookMember = useSearchPage();

  const renderedTabs = hookMember.typeList.map((e) => (
    <TabPane tab={e} key={e} />
  ));

  return (
    <Flex css={{ paddingLeft: spacing(1), paddingRight: spacing(1) }}>
      <AddWorldModal
        onCancel={() => {
          hookMember.onClickCloseAddWorldModal();
        }}
        onOk={(w) => {
          hookMember.onAddWorld(w);
        }}
        visible={hookMember.visibleAddWorldModal}
        types={hookMember.typeList}
      />
      <Search
        placeholder="Type Search Text"
        allowClear
        onSearch={hookMember.onSearchWorlds}
        css={{
          marginTop: spacing(1),
        }}
        loading={hookMember.isLoading}
      />

      <Tabs
        activeKey={hookMember.currentType}
        onChange={hookMember.onChangeSheetTab}
      >
        {renderedTabs}
      </Tabs>
      <Button
        size="small"
        css={{ marginLeft: 'auto', alignSelf: 'center' }}
        icon={<ReloadOutlined />}
        onClick={() => hookMember.onClickRefresh()}
        loading={hookMember.isLoading}
      />

      <Spin spinning={hookMember.isLoading}>
        <Table<World>
          dataSource={hookMember.currentTableData}
          scroll={{
            x: true,
          }}
          footer={(data) => (
            <FlexRow>
              <Button
                type="primary"
                css={{ marginLeft: 'auto' }}
                onClick={(e) => {
                  hookMember.onClickOpenAddWorldModal();
                }}
              >
                월드 추가
              </Button>
            </FlexRow>
          )}
        >
          <Column
            width="10%"
            title="이미지"
            dataIndex="imageUrl"
            render={(imageUrl) => (
              <>
                <Image src={imageUrl} width={130} />
              </>
            )}
            ellipsis
          />
          <Column
            width="10%"
            title="이름"
            dataIndex="name"
            sorter={(a: World, b: World) => a.name.localeCompare(b.name)}
            ellipsis
          />
          <Column
            width="10%"
            title="제작자"
            dataIndex="author"
            sorter={(a: World, b: World) => a.author.localeCompare(b.author)}
            ellipsis
          />
          <Column
            width="20%"
            title="설명"
            dataIndex="description"
            render={(value) => (
              <Typography.Paragraph css={{ wordBreak: 'keep-all' }}>
                {value}
              </Typography.Paragraph>
            )}
          />
          <Column
            width="15%"
            title="태그"
            dataIndex="tags"
            render={(tags: any[]) => (
              <>
                {tags.map((tag, index) => {
                  const colorIndex =
                    simpleStringHash(tag) % PresetColorTypes.length;
                  const color = PresetColorTypes[colorIndex];
                  return (
                    <>
                      <Tag color={color} key={tag}>
                        {tag.toUpperCase()}
                      </Tag>
                      {index / 3 > 0 && index % 3 === 0 ? <br /> : undefined}
                    </>
                  );
                })}
              </>
            )}
            ellipsis
          />
          <Column
            width="5%"
            title="별점"
            dataIndex="score"
            render={(score: number) => (
              <FlexRow>
                {new Array(score).fill(null).map((_, index) => (
                  <StarFilled key={index} />
                ))}
              </FlexRow>
            )}
            sorter={(a: World, b: World) => a.score - b.score}
          />
          <Column
            width="15%"
            title="URL"
            dataIndex="url"
            render={(url: string) => (
              <Typography.Link href={url} target="_blank">
                {url}
              </Typography.Link>
            )}
          />
          <Column
            width="5%"
            dataIndex="key"
            render={(k, record) => (
              <Popconfirm
                title="정말 월드를 삭제하시겠습니까?"
                placement="topRight"
                onConfirm={() => hookMember.onRemoveWorld(k)}
              >
                <Button danger size="small">
                  삭제
                </Button>
              </Popconfirm>
            )}
          />
        </Table>
      </Spin>
    </Flex>
  );
}
