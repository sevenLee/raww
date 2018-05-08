import React, { Component } from 'react'
import { Table } from 'react-bootstrap'

class VTable extends Component{

    makeCell(prop, data, colMapElm) {
        switch(colMapElm.style){
            case 'custom':
            {
                if(colMapElm.makeCell && typeof colMapElm.makeCell === 'function'){
                    return colMapElm.makeCell(data[prop], data)
                }else if(colMapElm.makeCell && typeof colMapElm.makeCell[0] === 'function'){
                    let argumentList = colMapElm.makeCell.filter((elm, index) => index !== 0)
                    argumentList.unshift(data)
                    argumentList.unshift(data[prop])
                    return colMapElm.makeCell[0](...argumentList)
                }else {
                    return data[prop]
                }
            }
            default:
            {
                return data[prop]
            }
        }
    }

    renderRows() {
        const { colMap, data } = this.props
        const visibleRows = []

        for(let prop in data) {
            const colMapElm = colMap[prop]
            const title = () => {
                if(colMapElm.headerContent && typeof colMapElm.headerContent === 'function') {
                    return colMapElm.headerContent();
                }

                return colMapElm.headerContent;
            }
            if(colMapElm) {
                visibleRows[colMapElm.index] = (
                    <tr key={colMapElm.index}>
                        <td key="1" className="head">{title()}</td>
                        <td key="2" className="content">{this.makeCell(prop, data, colMapElm)}</td>
                    </tr>
                )
            }
        }

        return visibleRows
    }

    render() {
        const {config} = this.props

        let baseClass = ['vertical-table']
        const tableClassList = (config && config.addClass) ? baseClass.concat(config.addClass) : baseClass
        let tableClass = tableClassList.join(' ')

        if(config.replaceClass) {
            tableClass = config.replaceClass
        }


        return (
            <Table responsive className={tableClass}>
                <tbody>
                {this.renderRows()}
                </tbody>
            </Table>
        )
    }
}

export default VTable