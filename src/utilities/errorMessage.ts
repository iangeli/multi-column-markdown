import { DOMObjectTag, ElementColumnBreakType } from "src/dom_manager/domObject"
import { RegionErrorManager } from "src/dom_manager/regionErrorManager"

export function createColBreakWarning(detail: string, type: ElementColumnBreakType, errorManager: RegionErrorManager) {

    let typeErrorStr = ""
    if(type === ElementColumnBreakType.preBreak) {
        typeErrorStr = "at the begining of another element"
    }
    if(type === ElementColumnBreakType.postBreak) {
        typeErrorStr = "at the end of another element"
    }
    if(type === ElementColumnBreakType.midBreak) {
        typeErrorStr = "in the middle of two elements"
    }

    errorManager.addWarningMessage(`Detected a column break tag ${typeErrorStr}. ${detail}. Please make sure to surround column breaks with empty lines on both sides, or render issues may occur.`)
}

export interface ColBreakTypeInfo {
    lineAbove: string;
    lineBelow: string;
    objectTag: DOMObjectTag;
    colBreakType: ElementColumnBreakType
}
export function parseColBreakErrorType(elementInfo: ColBreakTypeInfo, errorManager: RegionErrorManager) {

    if(elementInfo.objectTag !== DOMObjectTag.columnBreak &&
       elementInfo.colBreakType === ElementColumnBreakType.none) {
        return;
    }

    let errorType: ElementColumnBreakType = elementInfo.colBreakType;
    let lineAbove = elementInfo.lineAbove.trim();
    let lineBelow = elementInfo.lineBelow.trim();
    let detail = ""
    if(elementInfo.objectTag === DOMObjectTag.columnBreak) {

        if(lineAbove === "" && lineBelow === "") {
            return;
        }

        if(lineAbove !== "" && lineBelow === "") {
            errorType = ElementColumnBreakType.postBreak
            detail = `above: '${lineAbove}'`
        }
        if(lineAbove === "" && lineBelow !== "") {
            errorType = ElementColumnBreakType.preBreak
            detail = `below: '${lineBelow}'`
        }
        if(lineAbove !== "" && lineBelow !== "") {
            errorType = ElementColumnBreakType.midBreak
            detail = `above: '${lineAbove}', below: '${lineBelow}'`
        }
    }
    createColBreakWarning(detail, errorType, errorManager)
}