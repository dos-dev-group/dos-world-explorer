import { StarFilled } from '@ant-design/icons';
import { Button, Image, Select, Spin, Table, Tabs, Tag } from 'antd';
import { PresetColorTypes } from 'antd/lib/_util/colors';
import { Flex, FlexRow } from '@src/renderer/components/styledComponents';
import simpleStringHash from '@src/renderer/utils/simpleStringHash';
import { spacing } from '@src/renderer/utils/styling';
import { World, WorldSortOrder } from '@src/types';
import Search from 'antd/lib/input/Search';
import useSearchPage from './hooks/useSearchPage';

const { TabPane } = Tabs;
const { Column } = Table;
const { Option } = Select;

export default function SearchPage() {
  const hookMember = useSearchPage();

  const renderedTabs = hookMember.typeList.map((e) => (
    <TabPane tab={e} key={e} />
  ));

  return (
    <Flex css={{ paddingLeft: spacing(1), paddingRight: spacing(1) }}>
      <Search
        placeholder="Type Search Text"
        allowClear
        onSearch={hookMember.onSearchWorlds}
        css={{
          marginTop: spacing(2),
        }}
      />
      <Spin spinning={hookMember.isLoading}>
        <Tabs
          activeKey={hookMember.currentType}
          onChange={hookMember.onChangeSheetTab}
        >
          {renderedTabs}
        </Tabs>
        <Table<World>
          dataSource={hookMember.currentTableData}
          scroll={{
            x: true,
          }}
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
        </Table>
      </Spin>
    </Flex>
  );
}
