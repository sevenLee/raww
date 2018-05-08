import React, { Component } from 'react'
import { Table } from 'react-bootstrap'

export class RepoTable extends Component{
    makeTitle(colMapElm, prop) {
        const  {config: {sortCol, descending}, sortColState, descendingState, onSorting} = this.props
        const sortActive = (sortCol === prop)
        const title = () => {
            if(colMapElm.headerContent && typeof colMapElm.headerContent === 'function') {
                return colMapElm.headerContent();
            }

            return colMapElm.headerContent;
        }


        if (!colMapElm.sorting) {
            return <span>{ title() }</span>
        }

        return (
            <span
                className={`sorting-title${sortActive? ' active' : ''}`}
                onClick={(e) => {
                    colMapElm.sorting.onClick(e, prop, sortColState, descendingState, onSorting)
                }}
            >
                { title() }
                {
                    sortActive?
                        descending?
                            <span dangerouslySetInnerHTML={{ __html: '&nbsp;\u25BC' }} /> :
                            <span dangerouslySetInnerHTML={{ __html: '&nbsp;\u25B2' }} />
                        :
                        <span dangerouslySetInnerHTML={{ __html: '&nbsp;\u25BD' }} />
                }
            </span>
        )

    }

    makeFilter(colMapElm, prop) {
        const {sortColState, descendingState, onFilting} = this.props
        return (
            (colMapElm.filter)?
                <div className="filter">
                    <input
                        onChange={(e) => colMapElm.filter.onChange(e, prop, sortColState, descendingState, onFilting)}
                    />
                </div>
                :
                null
        )
    }

    makeTHNode(prop, colMapElm) {
        const { config: {hasIndex} } = this.props
        let inlineStyle = (colMapElm.thInlineStyle) ? colMapElm.thInlineStyle : {}
        let classStyle = colMapElm.align || 'text-right'

        if(hasIndex && prop === 'firstColIndex') {
            inlineStyle = Object.assign(inlineStyle, {
                width: 45
            })
        }

        return (
            <th className={(colMapElm.sorting)?`${classStyle} sorting`:classStyle} style={inlineStyle} key={colMapElm.index} >
                {this.makeTitle(colMapElm, prop)}
                {this.makeFilter(colMapElm, prop)}
            </th>
        )
    }

    renderHeader() {
        const { colMap, config } = this.props
        const visibleHeaders = []

        for(let prop in colMap) {
            const colMapElm = colMap[prop]
            visibleHeaders[colMapElm.index] = this.makeTHNode(prop, colMapElm, config)
        }

        return visibleHeaders
    }

    makeCell(prop, row, colMapElm) {
        let cellVal = row[prop]

        switch(colMapElm.style){
            case 'custom':
            {
                if(colMapElm.makeCell && typeof colMapElm.makeCell === 'function'){
                    return colMapElm.makeCell(cellVal, row)
                }else if(colMapElm.makeCell && typeof colMapElm.makeCell[0] === 'function'){
                    let argumentList = colMapElm.makeCell.filter((elm, index) => index !== 0)
                    argumentList.unshift(row)
                    argumentList.unshift(cellVal)
                    return colMapElm.makeCell[0](...argumentList)
                }else {
                    return cellVal
                }
            }
            default:
            {
                return (
                    (colMapElm.onCellClick) ?
                        <a onClick={() => colMapElm.onCellClick(cellVal)}>{cellVal}</a>
                        :
                        cellVal
                )
            }
        }
    }

    renderRows() {
        const { colMap, config: { hasIndex, trClass, trOnClick, pageNum, pageSize=20 }, datas } = this.props
        const visibleRows = []
        const cellNum = Object.keys(colMap).length

        datas.forEach((row, index) => {
            const visibleCells = []

            // reset
            for(let i=0; i<cellNum; i++){
                visibleCells[i] = (
                    <td key={i} className={'text-right'} />
                )
            }

            const makeTRClass = () => {
                return (typeof trClass === 'function') ? trClass() : trClass
            }

            let trSingleClass = (row.customRepoRow)? makeTRClass() :''

            for(let prop in row) {
                const colMapElm = colMap[prop]
                if(colMapElm) {
                    let inlineStyle = (colMapElm.tdInlineStyle) ? colMapElm.tdInlineStyle : {}
                    let classStyle = colMapElm.align || 'text-right'

                    if(colMapElm.replaceTrClass) {
                        trSingleClass = colMapElm.replaceTrClass(trSingleClass, row[prop], row)
                    }

                    visibleCells[colMapElm.index] = (
                        <td key={colMapElm.index}
                            className={classStyle}
                            style={inlineStyle}>
                            {
                                this.makeCell(prop, row, colMapElm)
                            }
                        </td>
                    )
                }
            }

            if(hasIndex && !row.customRepoRow) {
                let classStyle = ''
                if(colMap.firstColIndex && colMap.firstColIndex.align){
                    classStyle = colMap.firstColIndex.align || 'text-right'
                }

                index = index+1
                if(pageNum){
                    index = index + (pageNum-1)*pageSize
                }

                visibleCells[0] = (
                    <td className={classStyle + " text-index"} key={0} >{index}</td>
                )
            }

            visibleRows[index] = (
                <tr
                    key={index}
                    onClick={(e) => trOnClick && trOnClick(e, row)}
                    className={trSingleClass}
                >
                    {visibleCells}
                </tr>
            )
        })
        return visibleRows
    }

    render() {
        const { config, config: {addClass}, descriptionComp } = this.props
        const defaultProps = {
            config: {
                responsive: true
            }
        }

        const finalConfig = Object.assign({}, defaultProps.config, config)

        let baseClass = ['bo-table']
        const tableClassList = (addClass) ? baseClass.concat(addClass) : baseClass
        let tableClass = tableClassList.join(' ')

        if(config.replaceClass) {
            tableClass = config.replaceClass
        }

        return (
            <div className="table-wrapper">
                {
                    descriptionComp &&
                    <div className="table-description">{descriptionComp}</div>
                }

                <Table
                    responsive={finalConfig.responsive}
                    className={tableClass}
                >
                    <thead>
                    <tr>
                        {this.renderHeader()}
                    </tr>
                    </thead>
                    <tbody>
                    {this.renderRows()}
                    </tbody>
                    {this.props.children}
                </Table>
            </div>
        )
    }
}

RepoTable.defaultProps = {
    config: {},
    colMap: {}
}

export default RepoTable
