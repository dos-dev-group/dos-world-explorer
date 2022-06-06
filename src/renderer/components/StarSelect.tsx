import { StarFilled } from '@ant-design/icons';
import { gold } from '@ant-design/colors';
import { Select } from 'antd';

const { Option } = Select;

const StarSelect = (props: {
  onSelect: (star: number | undefined) => void;
  value: number | undefined;
}) => {
  const value = props.value === undefined ? null : props.value;

  return (
    <Select
      value={value}
      onSelect={props.onSelect}
      css={{ width: 120 }}
      size="small"
    >
      <Option value={null}>선택안함</Option>
      <Option value={1}>
        <StarFilled css={{ color: gold.primary }} />
      </Option>
      <Option value={2}>
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
      </Option>
      <Option value={3}>
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
      </Option>
      <Option value={4}>
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
      </Option>
      <Option value={5}>
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
      </Option>
      <Option value={6}>
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
      </Option>
    </Select>
  );
};
export default StarSelect;
