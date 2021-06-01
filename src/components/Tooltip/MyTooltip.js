import { useState } from 'react';
import { Tooltip } from 'reactstrap';

function MyTooltip({ target, children }) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <Tooltip
      className='in'
      placement='top'
      isOpen={tooltipOpen}
      target={target}
      toggle={() => setTooltipOpen(!tooltipOpen)}
    >
      {children}
    </Tooltip>
  );
}

export default MyTooltip;
