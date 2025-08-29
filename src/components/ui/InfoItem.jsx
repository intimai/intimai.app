import React from 'react';
import Tooltip from './Tooltip';

const InfoItem = ({ icon, label, value }) => (
  <Tooltip text={label}>
    <div className="flex items-center gap-2">
      <div className="text-gray-400 flex-shrink-0">{React.cloneElement(icon, { className: 'w-4 h-4' })}</div>
      {value ? (
        <span className="text-xs text-gray-300 truncate">{value}</span>
      ) : (
        <span className="text-xs text-gray-500">N/A</span>
      )}
    </div>
  </Tooltip>
);

export default InfoItem;