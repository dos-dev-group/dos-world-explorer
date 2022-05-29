import {
  HeartFilled,
  HeartOutlined,
  ReloadOutlined,
  StarFilled,
} from '@ant-design/icons';
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
import { gold, red } from '@ant-design/colors';
import { PresetColorTypes } from 'antd/lib/_util/colors';
import { Flex, FlexRow } from '@src/renderer/components/styledComponents';
import simpleStringHash from '@src/renderer/utils/simpleStringHash';
import { spacing } from '@src/renderer/utils/styling';
import { World } from '@src/types';
import useSearchPage, { SearchOptions } from './hooks/useSearchPage';
import AddWorldModal from './AddWorldModal';
import WorldInfoModal from '../../components/WorldInfoModal';
import EditWorldModal from './EditWorldModal';

const { TabPane } = Tabs;
const { Column } = Table;
const { Option } = Select;
const { Search } = Input;

export default function SearchPage() {
  const hookMember = useSearchPage();

  const renderedTabs = hookMember.typeList.map((e) => (
    <TabPane tab={e} key={e} />
  ));

  const renderedOptions = hookMember.searchOptions.map((e) => {
    let name;
    switch (e) {
      case 'AUTHOR':
        name = '제작자';
        break;
      case 'DESCRIPTION':
        name = '설명';
        break;
      case 'NAME':
        name = '이름';
        break;
      case 'TAG':
        name = '태그';
        break;
    }
    return <Option key={e}>{name}</Option>;
  });

  return (
    <Flex css={{ paddingLeft: spacing(1), paddingRight: spacing(1) }}>
      <WorldInfoModal
        onCancel={() => {
          hookMember.onClickCloseWorldInfoModal();
        }}
        visible={hookMember.infoModalWorld ? true : false}
        world={hookMember.infoModalWorld}
      />
      <AddWorldModal
        onCancel={() => {
          hookMember.onCloseAddWorldModal();
        }}
        onOk={(w) => {
          hookMember.onAddWorld(w);
        }}
        visible={hookMember.visibleAddWorldModal}
        types={hookMember.typeList}
      />
      <EditWorldModal
        onCancel={() => hookMember.onCloseEditWorldModal()}
        onEdit={(key, w) => hookMember.onEditWorld(key, w)}
        types={hookMember.typeList}
        world={hookMember.editModalWorld}
      />

      <Search
        placeholder="검색어를 입력하세요"
        allowClear
        onSearch={hookMember.onSearchWorlds}
        css={{
          marginTop: spacing(1),
        }}
        loading={hookMember.isLoading}
        addonBefore={
          <Select<SearchOptions[number]>
            css={{ width: 100 }}
            defaultValue="NAME"
            onChange={(v) => {
              hookMember.onChangeSearchOption(v);
            }}
          >
            {renderedOptions}
          </Select>
        }
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
        <Table
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
                  hookMember.onOpenAddWorldModal();
                }}
              >
                월드 추가
              </Button>
            </FlexRow>
          )}
        >
          <Column
            width="5%"
            // title=""
            key="favorite"
            render={(_, record: World) => {
              if (hookMember.checkIsFavorite(record)) {
                return (
                  <HeartFilled
                    css={{ color: red.primary, fontSize: 20 }}
                    onClick={() => hookMember.onClickFavorite(record)}
                  />
                );
              }
              return (
                <HeartOutlined
                  css={{ color: red.primary, fontSize: 20 }}
                  onClick={() => hookMember.onClickFavorite(record)}
                />
              );
            }}
          />
          <Column
            width="10%"
            title="이미지"
            dataIndex="imageUrl"
            render={(imageUrl, record: World) => (
              <Image
                src={imageUrl}
                width={130}
                preview={false}
                onClick={(e) => {
                  hookMember.onClickOpenWorldInfoModal(record);
                }}
              />
            )}
          />
          <Column
            width="10%"
            title="이름"
            dataIndex="name"
            sorter={(a: World, b: World) => a.name.localeCompare(b.name)}
            onCell={(w) => ({
              style: {
                width: 200,
                wordBreak: 'keep-all',
              },
            })}
            ellipsis
            render={(_, world) => (
              <Typography.Link
                onClick={(e) => {
                  hookMember.onClickOpenWorldInfoModal(world);
                }}
              >
                {world.name}
              </Typography.Link>
            )}
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
              <Typography.Paragraph
                css={{ wordBreak: 'keep-all', width: '24vw' }}
                ellipsis={{ rows: 3, expandable: true }}
              >
                {value}
              </Typography.Paragraph>
            )}
          />
          <Column
            width="15%"
            title="태그"
            dataIndex="tags"
            ellipsis
            render={(tags: any[]) => (
              <>
                {tags.map((tag, index) => {
                  const colorIndex =
                    simpleStringHash(tag) % PresetColorTypes.length;
                  const color = PresetColorTypes[colorIndex];
                  return (
                    <span key={tag}>
                      <Tag color={color}>{tag.toUpperCase()}</Tag>
                      {(index + 1) / 4 > 0 && (index + 1) % 4 === 0 ? (
                        <br />
                      ) : undefined}
                    </span>
                  );
                })}
              </>
            )}
          />
          <Column
            width="10%"
            title="별점"
            dataIndex="score"
            render={(score: number) => (
              <FlexRow>
                {new Array(score).fill(null).map((_, index) => (
                  <StarFilled key={index} css={{ color: gold.primary }} />
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
            render={(k, record: World) => (
              <Flex>
                <Button
                  type="primary"
                  ghost
                  size="small"
                  onClick={() => hookMember.onOpenEditWorldModal(record)}
                >
                  수정
                </Button>
                <Popconfirm
                  title="정말 월드를 삭제하시겠습니까?"
                  placement="topRight"
                  onConfirm={() => hookMember.onRemoveWorld(k)}
                >
                  <Button danger size="small">
                    삭제
                  </Button>
                </Popconfirm>
              </Flex>
            )}
          />
        </Table>
      </Spin>
    </Flex>
  );
}
