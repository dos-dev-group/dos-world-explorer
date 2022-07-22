import styled from '@emotion/styled';

export const Flex = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

export const ContentFlex = styled(Flex)({
  maxWidth: 640,
  width: '100%',
  margin: '0 auto',
});

export const FlexRow = styled.div({
  display: 'flex',
  flexDirection: 'row',
});

export const FlexCenter = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

export const FlexRowCenter = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
});

export const Grid = styled.div({
  display: 'grid',
  // gridTemplateColumns: 'repeat(12, 1fr)',
  // gap: 2,
});

export const HoverOpacity = styled.div<{
  transitionTime?: number;
  hoverOpacity?: number;
}>((props) => {
  const transitionTime = props.transitionTime || 0.1;
  const opacity = props.hoverOpacity || 0.7;
  return {
    backgroundColor: 'white',
    transition: `all ${transitionTime}s ease-out`,
    ':hover': {
      opacity: opacity,
    },
  };
});
