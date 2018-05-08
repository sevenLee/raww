import React from 'react'
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import {Table} from '../src'


describe('Raw Table Test', () => {
    let output = null

    beforeEach(() => {
        output = shallow(
            <Table datas={[]} />
        )
    })

    it('should render empty table correctly', () => {
        expect(shallowToJson(output)).toMatchSnapshot();
    });

    it('should render a table dom', () => {
        expect(output.find('.table-wrapper')).toHaveLength(1);
    });

    it('should render description correctly', () => {
        const output = shallow(
            <Table datas={[]} descriptionComp={<span>has description</span>}/>
        );
        expect(shallowToJson(output)).toMatchSnapshot();
        expect(output.find('.table-description')).toHaveLength(1);
        expect(output.find('.table-description').html()).toEqual('<div class="table-description"><span>has description</span></div>');
    });

    it('should render children (tfoot) correctly', () => {
        const outputWithChildren = shallow(
            <Table datas={[]}>
                <tfoot className="table-tfoot"><tr><td>has tfoot</td></tr></tfoot>
            </Table>
        );
        expect(shallowToJson(outputWithChildren)).toMatchSnapshot();
        expect(outputWithChildren.find('.table-tfoot')).toHaveLength(1);
        expect(outputWithChildren.find('.table-tfoot').html()).toEqual('<tfoot class="table-tfoot"><tr><td>has tfoot</td></tr></tfoot>');
    });



    describe('Raw Table render mock data',() => {
        let output = null
        let datas = [{playerId: 'playerId1', partner: 'a1'}, {playerId: 'playerId2', partner: 'a2'}]
        let colMap = {
            // firstColIndex: {index: 0, intlName: 'Index_Number',},
            playerId: {index:0, headerContent: () => 'Player ID'},
            partner: {index:1, headerContent: () => 'Partner'},
        }

        beforeEach(() => {
            output = shallow(<Table datas={datas} colMap={colMap}/>)
        })

        it('should render correctly with mock data', () => {
            expect(shallowToJson(output)).toMatchSnapshot();
        })

        it('should render 2 cols with data and column header', () => {
            expect(output.find('tbody > tr')).toHaveLength(2);
            expect(output.find('tbody > tr').at(0).childAt(0).text()).toEqual('playerId1');
            expect(output.find('tbody > tr').at(0).childAt(1).text()).toEqual('a1');
        })

        it('should render index column automatically when hasIndex true', () => {
            const colMapNew = {
                firstColIndex: {index: 0, headerContent: () => '#'},
                playerId: {index:1, headerContent: () => 'Player ID'},
                partner: {index:2, headerContent: () => 'Partner'},
            }

            const output = shallow(<Table datas={datas} colMap={colMapNew} config={{hasIndex: true}}/>)
            expect(shallowToJson(output)).toMatchSnapshot();
            expect(output.find('tbody > tr').at(0).children()).toHaveLength(3);
            expect(output.find('tbody > tr').at(0).childAt(0).text()).toEqual('1');
        })
    })
})