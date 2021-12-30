import { Badge } from 'antd'
const BadgeTab = ({ friendName, unRead }) => {
    return (
        <>
            {friendName}
            <Badge count={unRead} offset={[5,-10]} key={`${friendName}`} />
        </>
    )
}

export default BadgeTab;