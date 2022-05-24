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
} from 'antd';
import { PresetColorTypes } from 'antd/lib/_util/colors';
import { Flex, FlexRow } from '@src/renderer/components/styledComponents';
import simpleStringHash from '@src/renderer/utils/simpleStringHash';
import { spacing } from '@src/renderer/utils/styling';
import { World, WorldSortOrder } from '@src/types';
import useSearchPage from './hooks/useSearchPage';
import AddWorldModal from './AddWorldModal';
import WorldInfoModal from './WorldInfoModal';
import { css } from '@emotion/react';

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
      <WorldInfoModal
        onCancel={() => {
          hookMember.onClickCloseWorldInfoModal();
        }}
        onOk={() => {
          hookMember.onClickCloseWorldInfoModal();
        }}
        visible={hookMember.visibleWorldInfoModal}
        types={hookMember.typeList}
        worldKey={hookMember.keyOfWorldInfoModal}
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
            title="Image"
            dataIndex="imageUrl"
            render={(imageUrl) => (
              <>
                <Image src={imageUrl} />
              </>
            )}
          />
          <Column
            width="15%"
            title="Name"
            dataIndex="name"
            sorter={(a: World, b: World) => a.name.localeCompare(b.name)}
            render={(_, world) => (
              <>
                <a
                  onClick={(e) => {
                    hookMember.onClickOpenWorldInfoModal(world.key);
                  }}
                >
                  {world.name}
                </a>
              </>
            )}
          />
          <Column
            width="10%"
            title="Author"
            dataIndex="author"
            sorter={(a: World, b: World) => a.author.localeCompare(b.author)}
          />
          <Column width="25%" title="Description" dataIndex="description" />
          <Column
            width="10%"
            title="Tags"
            dataIndex="tags"
            render={(tags: any[]) => (
              <>
                {tags.map((tag) => {
                  const colorIndex =
                    simpleStringHash(tag) % PresetColorTypes.length;
                  const color = PresetColorTypes[colorIndex];
                  return (
                    <Tag color={color} key={tag}>
                      {tag.toUpperCase()}
                    </Tag>
                  );
                })}
              </>
            )}
          />
          <Column
            width="20%"
            title="URL"
            dataIndex="url"
            render={(url: string) => (
              <Button
                type="link"
                onClick={() => hookMember.onClickUrl(url)}
                css={{ whiteSpace: 'normal' }}
              >
                {url}
              </Button>
            )}
          />
          <Column
            width="10%"
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
