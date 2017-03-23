import React from 'react';
import Memo from './Memo';

class MemoList extends React.Component {
    render() {
        const mapToComponents = data => {
            return data.map((memo, i) => {
                let ownership = (memo.writer === this.props.currentUser);
                return (<Memo
                            data={memo}
                            ownership={ownership}
                            key={memo.id}
                />);
            });
        };

        return (
            <div>
                {mapToComponents(this.props.data)}
            </div>
        );
    }
}

MemoList.propTypes = {
    data: React.PropTypes.array,
    currentUser: React.PropTypes.string
};

MemoList.defaultProps = {
    data: [],
    currentUser: ''
};

export default MemoList;
