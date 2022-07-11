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
import StarSelect from '@src/renderer/components/StarSelect';
import BookmarkSelectModal from '@src/renderer/components/BookmarkSelectModal';
import useWorldSheetPage, { SearchOptions } from './hooks/useWorldSheetPage';
import AddWorldModal from './AddWorldModal';
import WorldInfoModal from '../../components/WorldInfoModal';
import EditWorldModal from './EditWorldModal';
import useBookmark from '../../utils/hooks/useBookmark';

const { TabPane } = Tabs;
const { Column } = Table;
const { Option } = Select;
const { Search } = Input;

export default function WorldSheetPage() {
  const hookMember = useWorldSheetPage();
  const bookmarkHookMember = useBookmark();

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
        name = '제목';
        break;
      case 'TAG':
        name = '태그';
        break;
    }
    return <Option key={e}>{name}</Option>;
  });

  return (
    <Flex css={{ paddingLeft: spacing(1), paddingRight: spacing(1) }}>
      <BookmarkSelectModal
        bookmarkTypes={bookmarkHookMember.bookmarkTypes}
        visible={bookmarkHookMember.isOpenBookmarkModal}
        preSelectType={bookmarkHookMember.targetWorldTypes}
        onOk={(types: string[]): void => {
          bookmarkHookMember.onChangeBookmarkWorld(types);
          bookmarkHookMember.onCloseBookmarkModal();
        }}
        onCancel={(): void => {
          bookmarkHookMember.onCloseBookmarkModal();
        }}
        onAddBookmarkItem={(type: string): void => {
          bookmarkHookMember.onAddBookmarkType(type);
        }}
      />
      <WorldInfoModal
        onCancel={() => {
          hookMember.onCloseWorldInfoModal();
        }}
        visible={hookMember.infoModalWorld ? true : false}
        world={hookMember.infoModalWorld}
        onEdit={(world) => {
          hookMember.onOpenEditWorldModal(world);
        }}
        onRemove={(world) => {
          hookMember.onRemoveWorld(world.key);
        }}
        isBookmarked={
          hookMember.infoModalWorld
            ? bookmarkHookMember.checkIsSomewhereBookmarkedWorld(
                hookMember.infoModalWorld,
              )
            : false
        }
        onClickBookmark={(world) =>
          bookmarkHookMember.onClickOpenBookmarkModal(world)
        }
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

      <FlexRow css={{ marginLeft: 'auto', alignItems: 'center' }}>
        <Button
          size="small"
          icon={<ReloadOutlined />}
          onClick={() => hookMember.onClickRefresh()}
          loading={hookMember.isLoading}
        />
      </FlexRow>

      <Spin spinning={hookMember.isLoading}>
        <Table
          dataSource={hookMember.currentTableData}
          scroll={{
            x: true,
          }}
          pagination={{
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              hookMember.onChangePage(page);
            },
            current: hookMember.currentPage,
          }}
          footer={(data) => (
            <FlexRow css={{ gap: spacing(2) }}>
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
            key="bookmark"
            render={(_, record: World) => {
              if (bookmarkHookMember.checkIsSomewhereBookmarkedWorld(record)) {
                return (
                  <HeartFilled
                    css={{ color: red.primary, fontSize: 20 }}
                    onClick={() =>
                      bookmarkHookMember.onClickOpenBookmarkModal(record)
                    }
                  />
                );
              }
              return (
                <HeartOutlined
                  css={{ color: red.primary, fontSize: 20 }}
                  onClick={() =>
                    bookmarkHookMember.onClickOpenBookmarkModal(record)
                  }
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
            title="제목"
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
              <FlexRow css={{ width: 90 }}>
                {new Array(score).fill(null).map((_, index) => (
                  <StarFilled key={index} css={{ color: gold.primary }} />
                ))}
              </FlexRow>
            )}
            sorter={(a: World, b: World) => a.score - b.score}
            filters={scoreFilters}
            onFilter={(value, record) => value === record.score}
          />
          {/* <Column
            width="15%"
            title="URL"
            dataIndex="url"
            render={(url: string) => (
              <Typography.Link href={url} target="_blank">
                {url}
              </Typography.Link>
            )}
          /> */}
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

const scoreFilters = [
  {
    text: (
      <FlexRow>
        <StarFilled css={{ color: gold.primary }} />
      </FlexRow>
    ),
    value: 1,
  },
  {
    text: (
      <FlexRow>
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
      </FlexRow>
    ),
    value: 2,
  },
  {
    text: (
      <FlexRow>
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
      </FlexRow>
    ),
    value: 3,
  },
  {
    text: (
      <FlexRow>
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
      </FlexRow>
    ),
    value: 4,
  },
  {
    text: (
      <FlexRow>
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
      </FlexRow>
    ),
    value: 5,
  },
  {
    text: (
      <FlexRow>
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
      </FlexRow>
    ),
    value: 6,
  },
];
