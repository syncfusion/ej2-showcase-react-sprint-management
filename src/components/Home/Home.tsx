import { GanttComponent, Inject, Edit, Selection, Toolbar, DayMarkers } from '@syncfusion/ej2-react-gantt';
import { KanbanComponent, ColumnsDirective as KanbanColumnsDirective, ColumnDirective as KanbanColumnDirective, dataBound } from "@syncfusion/ej2-react-kanban";
import { GridComponent, ColumnsDirective as GridColumnsDirective, ColumnDirective as GridColumnDirective, Inject as GridInject, Page, Edit as GridEdit, Toolbar as GridToolbar, Group } from '@syncfusion/ej2-react-grids';
import { ScheduleComponent, TimelineViews, TimelineMonth, Inject as SchedulerInject, ResourcesDirective, ResourceDirective, ViewsDirective, ViewDirective, DragAndDrop, Resize, TimelineYear, ExcelExport, ICalendarExport, ICalendarImport, Print, Day, Week, WorkWeek, Month, Year, Agenda } from '@syncfusion/ej2-react-schedule';
import { useEffect } from 'react';
import { changeDataSource, editingResources, sprintData1, sprintData2, sprintData3 } from '../../assets/dataSource';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DateTimePicker } from '@syncfusion/ej2-react-calendars';
import { DataManager } from '@syncfusion/ej2-data';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import React = require('react');
import { CardTemplate, KanbanTemplate } from '../template';
import { cardRendered, enddateValueAccessor, gridGroupTemplate, queryTaskbarInfo, resourceValueAccessor, scheduleeventRendered, startdateValueAccessor } from '../helper';
declare global {
  interface Window {
    commonData: any[];
    sprintData1: any[];
    sprintData2: any[];
    sprintData3: any[];
  }
}
type KanbanType = {
  dataSource: any;
};
interface DropdownType {
  value: string | undefined;
}

export const Home = () => {
  useEffect(() => {
    updateCardValue();
    bindClickEvent(); 
    bindTabClickEvent();
    bindEventListeners();
    bindScrollEvent();
    adjustElementHeight()
    function handleResize() {
      if (window.innerWidth < 500) {
        document.getElementsByClassName('component-contain')[0].classList.remove('add-overflow');
      } else {
        document.getElementsByClassName('component-contain')[0].classList.add('add-overflow');
        adjustElementHeight()
      }
      if (window.innerWidth >= 700) {
        const centeredDiv = document.querySelector('.mobile-nav-bar') as HTMLDivElement;
        let storedClassName: string | undefined;
        if (centeredDiv) {
          const elements = centeredDiv.querySelectorAll('div');
          elements.forEach(function (element: HTMLDivElement) {
            if (element.classList.contains('show1-background')) {
              storedClassName = element.classList[0];
              element.classList.remove('show1-background');
            }
          });
          if (storedClassName) {
            (document.getElementsByClassName(storedClassName)[0] as HTMLElement).classList.add("show1-background");
          }
        }
      } else {
        const centeredDiv = document.querySelector('.centered-div') as HTMLDivElement;
        let storedClassName: string | undefined;
        if (centeredDiv) {
          const elements = centeredDiv.querySelectorAll('div');
          elements.forEach(function (element: HTMLDivElement) {
            if (element.classList.contains('show1-background')) {
              storedClassName = element.classList[0];
              element.classList.remove('show1-background');
            }
          });
          if (storedClassName) {
            (document.getElementsByClassName(storedClassName)[1] as HTMLElement).classList.add("show1-background");
          }
        }
      }
    }
    function handleLoad() {
      if (window.innerWidth < 500) {
        document.getElementsByClassName('component-contain')[0].classList.remove('add-overflow');
      } else {
        document.getElementsByClassName('component-contain')[0].classList.add('add-overflow');
        adjustElementHeight()
      }
      if (window.innerWidth < 380) {
        (document.getElementsByClassName("parent-kanban")[1] as HTMLElement).classList.add("show1-background");
      }
    }
    window.addEventListener('resize', handleResize);
    window.addEventListener('load', handleLoad);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  window.sprintData1 = sprintData1
  window.sprintData2 = sprintData2
  window.sprintData3 = sprintData3
  window.commonData = sprintData1;

  let [data, setData] = React.useState(window.commonData);
  let status: any;
  let gantt = React.useRef(null);
  let kanbanObj = React.useRef(null);
  let gridObj = React.useRef(null);
  let scheduleObj = React.useRef(null);
  let topDropDownInstance = React.useRef(null);
  let dateRangeInstance = React.useRef(null);
  let resourceSelectValue: string | any;
  let gridstatuselem: any;
  let gridstatusdropdownlistObj: any;
  let gridprioritydropdownlistObj: any;
  let gridpriorityelem: any;
  let gridresourceelem: any;
  let gridresourcedropdownlistObj: any;
  let scheduleprogressValue: any;
  let storeScheduleEditID: any;
  let ganttprogressValue: any;
  let ganttisProgressResize: any;
  let gridresource: any;
  let gridresourceObj: any;
  let elem: any;
  let dropdownlistObj: any;
  let elem3: any;
  let dropdownlistObj3: any;
  let isDataChanged: any;
  let isStatusChange: any;
  let kanbanprogressValue: any;
  let storeStatusValue: any
  let storeNewRecord : any;

  function adjustElementHeight() {
    const element = document.getElementsByClassName('main-content')[0] as HTMLElement;
    const elementHeight = element.clientHeight -
      parseFloat(getComputedStyle(element).paddingTop) -
      parseFloat(getComputedStyle(element).paddingBottom) -
      parseFloat(getComputedStyle(element).marginTop) -
      parseFloat(getComputedStyle(element).marginBottom);
    const filterHeight = document.getElementsByClassName('datasource-filter-container')[0].getBoundingClientRect().height;
    const titleHeight = document.getElementsByClassName('title-container')[0].getBoundingClientRect().height;
    const changeElement = document.getElementsByClassName('component-contain')[0] as HTMLElement;
    const desiredHeight = elementHeight - (filterHeight + titleHeight);
    changeElement.style.height = (desiredHeight -10)+ 'px';
    if ((desiredHeight -87.5) > 549 && (desiredHeight -87.5) < 1433) {
      document.getElementById('component-render-grid').style.height = (desiredHeight -89)+ 'px';
    } else if ((desiredHeight -87.5) > 1433) {
      document.getElementById('component-render-grid').style.height = (desiredHeight -94)+ 'px';
    }
    else {
      document.getElementById('component-render-grid').style.height = (desiredHeight -87.5)+ 'px';
    }
  }

  const updateDataSourceObject = (dataSource: any, id: any, updateData: any) => {
    const targetObject = dataSource.find((obj: { Id: any; }) => obj.Id === id);
    if (targetObject) {
      for (const key in updateData) {
        targetObject[key] = updateData[key];
      }
    }
  };
  function updateCommonDataAndRefreshComponents(commonData: any) {
    window.commonData = commonData;
    setData(commonData);
    setTimeout(() => {
      updateCardValue(commonData);
    }, 300);
  }
  function resourceFilterImage(value: any): void {
    const projectValue = topDropDownInstance.current.value;
    const dateRangeValue = dateRangeInstance.current.value;
    const currentData = window[`sprintData${(projectValue as string).slice(-1)}` as keyof Window];
    if (value) {
      const filteredData = currentData.filter((item: { resources: any; StartTime: string | number | Date; EndTime: string | number | Date; }) => {
        const resourceMatch =
          typeof value === 'string' && value &&
          item.resources === value;
        const dateMatch =
          !dateRangeValue ||
          (new Date(item.StartTime) >= dateRangeInstance.current.startDate &&
            new Date(item.EndTime) <= dateRangeInstance.current.endDate);

        return resourceMatch && dateMatch;
      });

      updateCommonDataAndRefreshComponents(filteredData);
    } else {
      updateCommonDataAndRefreshComponents(currentData);
    }
  }
  function bindClickEvent(): void {
    let anchorTags: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('body a');
    if (anchorTags) {
      for (let i = 0; i < anchorTags.length; i++) {
        let currentAnchor = anchorTags[i];
        if (currentAnchor) {
          if (currentAnchor.textContent && currentAnchor.textContent.trim() === 'Claim your free account') {
            let parentElement: Element | null = currentAnchor.parentElement;
            if (parentElement) {
              parentElement.remove()
            }
          }
        }
      }
    }
    const imageContainer: HTMLElement | null = document.getElementById('image-container') as HTMLElement;
    if (imageContainer) {
      const circularImages: NodeListOf<HTMLElement> = imageContainer.querySelectorAll('.circular-image');
      circularImages.forEach((image: HTMLElement) => {
        image.addEventListener('click', (event: Event) => {
          const target = event.target as HTMLImageElement;
          if (target.tagName === 'IMG') {
            let altText: any = target.alt;
            if (altText) {
              if (resourceSelectValue == altText) {
                altText = null
              }
              resourceSelectValue = altText
              resourceFilterImage(altText);
              if (target.classList.contains('selected-image')) {
                target.classList.remove('selected-image');
              } else {
                circularImages.forEach(img => {
                  img.classList.remove('selected-image');
                });

                // Add box shadow to the clicked image
                target.classList.add('selected-image');
              }
            }
          }
        });
      });
    }
  }
  function bindTabClickEvent(): void {
    const tabInfo = [
      { name: 'kanban', componentId: 'component-renderf', parentClassName: 'parent-kanban', refreshFunction: () => { kanbanObj.current.refresh(); } },
      { name: 'scheduler', componentId: 'component-render-scheduler', parentClassName: 'parent-scheduler', refreshFunction: () => { scheduleObj.current.refresh(); } },
      { name: 'gantt', componentId: 'component-render-gantt', parentClassName: 'parent-gantt', refreshFunction: () => { gantt.current.refresh(); } },
      { name: 'grid', componentId: 'component-render-grid', parentClassName: 'parent-grid', refreshFunction: () => { gridObj.current.refresh(); } }
    ];
    const setActiveTab = (activeTab: HTMLElement): void => {
      tabInfo.forEach(tab => {
        const parentElement = document.getElementsByClassName(tab.parentClassName)[0] as HTMLElement;
        const component = document.getElementById(tab.componentId) as HTMLElement;
  
        if (parentElement && component) {
          parentElement.classList.remove("show1-background");
          component.classList.remove("show1");
          component.style.display = 'none';
        }
      });
      if (activeTab) {
        activeTab.classList.add("show1-background");
        const activeComponent = tabInfo.find(tab => activeTab.classList.contains(tab.parentClassName));
        if (activeComponent) {
          const component = document.getElementById(activeComponent.componentId) as HTMLElement;
          if (component) {
            component.style.display = 'block';
            component.classList.add("show1");
            activeComponent.refreshFunction();
          }
        }
      }
    };
    tabInfo.forEach(tab => {
      const parentElements = document.getElementsByClassName(tab.parentClassName);
      Array.from(parentElements).forEach((element: HTMLElement) => {
        element.addEventListener("click", () => {
          setActiveTab(element);
        });
      });
    });
    // Set initial active tab
    const initialTab = document.getElementsByClassName(tabInfo[0].parentClassName)[0] as HTMLElement;
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }
  function bindEventListeners(): void {
    const tabInfo = [
      { name: 'kanban', componentId: 'component-renderf', parentClassName: 'parent-kanban', refreshFunction: () => { kanbanObj.current.refresh(); } },
      { name: 'scheduler', componentId: 'component-render-scheduler', parentClassName: 'parent-scheduler', refreshFunction: () => { scheduleObj.current.refresh(); } },
      { name: 'gantt', componentId: 'component-render-gantt', parentClassName: 'parent-gantt', refreshFunction: () => { gantt.current.refresh(); } },
      { name: 'grid', componentId: 'component-render-grid', parentClassName: 'parent-grid', refreshFunction: () => { gridObj.current.refresh(); } }
    ];
    const setActiveTab = (activeTab: HTMLElement): void => {
      tabInfo.forEach(tab => {
        const parentElement = document.getElementsByClassName(tab.parentClassName)[1] as HTMLElement;
        const component = document.getElementById(tab.componentId) as HTMLElement;
        if (parentElement && component) {
          parentElement.classList.remove("show1-background");
          component.classList.remove("show1");
          component.style.display = 'none';
        }
      });
      if (activeTab) {
        activeTab.classList.add("show1-background");
        const activeComponent = tabInfo.find(tab => activeTab.classList.contains(tab.parentClassName));
        if (activeComponent) {
          const component = document.getElementById(activeComponent.componentId) as HTMLElement;
          if (component) {
            component.style.display = 'block';
            component.classList.add("show1");
            activeComponent.refreshFunction();
          }
        }
      }
    };
    const parentElements = document.getElementsByClassName("mobile-nav-bar")[0] as HTMLElement;
    Array.from(parentElements.children).forEach((element: HTMLElement) => {
      element.addEventListener('click', () => {
        const activeTab = element as HTMLElement;
        setActiveTab(activeTab);
      });
    });
  
    // Set initial active tab
    const initialTab = document.getElementsByClassName(tabInfo[0].parentClassName)[1] as HTMLElement;
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }  
  function bindScrollEvent(): void {
    const createContainer = document.querySelector('.create-container') as HTMLElement | null;
    if (createContainer) {
      createContainer.addEventListener('scroll', handleScroll);
    }
    function handleScroll(event: Event): void {
      const target = event.currentTarget as HTMLElement;
      if (target.scrollTop > 110) {
        hideDatasourceFilter();
      } else {
        showDatasourceFilter();
      }
    }
    function hideDatasourceFilter(): void {
      const datasourceFilter = document.querySelector('.datasource-filter-container') as HTMLElement | null;
      if (datasourceFilter) {
        datasourceFilter.style.visibility = 'hidden';
      }
    }
    function showDatasourceFilter(): void {
      const datasourceFilter = document.querySelector('.datasource-filter-container') as HTMLElement | null;
      if (datasourceFilter) {
        datasourceFilter.style.visibility = '';
      }
    }
  }  
  const customFn = (args: { [key: string]: string }) => {
    let value: number = parseInt(args['value'], 10); // Parse the value as a number with base 10
    const ganttStatusElement: any = document.getElementById('component-render-ganttStatus');
    if (ganttStatusElement) {
      if (ganttStatusElement.ej2_instances[0].value === "Done" && value < 100) {
        return false;
      } else {
        return true;
      }
    } else {
      if (status === "Done" && value < 100) {
        return false;
      } else {
        return true;
      }
    }
  };
  const gridcustomFn = (args: { [key: string]: string }) => {
    let value: number = parseInt(args['value'], 10); // Parse the value as a number with base 10
    const ganttStatusElement: any = document.getElementById('component-render-gridStatus');
    if (ganttStatusElement) {
      if (ganttStatusElement.ej2_instances[0].value === "Done" && value < 100) {
        return false;
      } else {
        return true;
      }
    } else {
      if (status === "Done" && value < 100) {
        return false;
      } else {
        return true;
      }
    }
  };
  const gridStatusCustomFn = (args: { [key: string]: string }) => {
    let value: any = args['value'];
    const progressElement: any = document.getElementById('component-render-gridProgress');
    if (progressElement.ej2_instances[0]) {
      if (progressElement.ej2_instances[0].value === 100 && (value === "InProgress" || value === "Testing" || value ==="Open")) {
        return false;
      } else {
        return true;
      }
    }
  }
  const updateCardValue = (passedData?: any) => {
    const projectValue = topDropDownInstance.current.value;
    const dateRangeValue = dateRangeInstance.current.value;
    const currentData = passedData ? passedData : window[`sprintData${(projectValue as string).slice(-1)}` as keyof Window];
    // Define type for counts
    type Counts = { InProgress: number; Testing: number; Open: number; Done: number };
    const counts: Counts = {
      InProgress: 0,
      Testing: 0,
      Open: 0,
      Done: 0,
    };
    currentData.forEach((item: { Status: keyof Counts }) => {
      counts[item.Status]++;
    });
    updateCardElement('.detailcontainertodo', counts.Open, 0);
    updateCardElement('.detailcontainertodo', counts.InProgress, 1);
    updateCardElement('.detailcontainertodo', counts.Testing, 2);
    updateCardElement('.detailcontainertodo', counts.Done, 3);
  }
  function updateCardElement(selector: string, count: number, indexNumber: number): void {
    const cardElement = document.querySelectorAll(selector)[indexNumber];
    const countTodoElement = cardElement?.querySelector('.counttodo');
    if (countTodoElement) {
      countTodoElement.innerHTML = count.toString();
    }
  }
  const filterAndUpdateData = (projectData: any) => {
    let filteredValue: any = projectData;
    if (resourceSelectValue) {
      filteredValue = filteredValue.filter((obj: { resources: any }) => {
        return resourceSelectValue == obj.resources
      });
    }
    if (dateRangeInstance.current.value !== null) {
      const givenStartDate = dateRangeInstance.current.startDate;
      const givenEndDate = dateRangeInstance.current.endDate;
      filteredValue = filteredValue.filter((obj: { StartTime: string | number | Date; EndTime: string | number | Date; }) => {
        const startDate = new Date(obj.StartTime);
        const endDate = new Date(obj.EndTime);
        const givenStartDateObj = new Date(givenStartDate);
        const givenEndDateObj = new Date(givenEndDate);

        return startDate >= givenStartDateObj && endDate <= givenEndDateObj;
      });
    }
    updateCommonDataAndRefreshComponents(filteredValue);
  };
  ///// Gantt
  const ganttcolumns = [
    { field: 'Id',width:'64px' },
    { field: 'Subject', width: '350px' },
    { field: 'StartTime' },
    { field: 'EndTime' },
    { field: 'Progress', validationRules: { required: true, minLength: [customFn, 'Progress Cant be less than 100 if the status is in Done'] } },
    {
      field: 'Status',
      edit: {
        create: () => {
          elem = document.createElement('input');
          return elem;
        },
        read: () => {
          return dropdownlistObj.value;
        },
        destroy: () => {
          dropdownlistObj.destroy();
        },
        write: (args: any) => {
          dropdownlistObj = new DropDownList({
            dataSource: [
              { Status: 'Open' },
              { Status: 'Testing' },
              { Status: 'InProgress' },
              { Status: 'Done' },
            ],
            fields: { value: 'Status' },
            value: args.rowData[args.column.field],
            floatLabelType: 'Auto',
          });
          dropdownlistObj.appendTo(elem);
        },
      }
    },
    {
      field: 'Priority',
      edit: {
        create: () => {
          elem3 = document.createElement('input');
          return elem3;
        },
        read: () => {
          return dropdownlistObj3.value;
        },
        destroy: () => {
          dropdownlistObj3.destroy();
        },
        write: (args: any) => {
          dropdownlistObj3 = new DropDownList({
            dataSource: [
              { Priority: 'Low' },
              { Priority: 'Critical' },
              { Priority: 'Normal' },
              { Priority: 'High' },
            ],
            fields: { value: 'Priority' },
            value: args.rowData[args.column.field],
            floatLabelType: 'Auto',
          });
          dropdownlistObj3.appendTo(elem3);
        },
      },
    }
  ]
  const ganttdataBound = (args: any) => {
    updateCardValue(gantt.current.dataSource)
  }
  const taskFields = {
    id: 'Id',
    name: 'Subject',
    startDate: 'StartTime',
    endDate: 'EndTime',
    duration: 'Duration',
    resourceInfo: 'resources',
    progress: 'Progress',
    dependency: 'Predecessor',
  };
  const editSettings: any = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    allowTaskbarEditing: true,
    mode: 'Dialog',
  };
  const resourceFields = {
    id: 'resourceId',
    name: 'resourceName',
  }
  const ganttactionBegin = (args: any) => {
    if (args.requestType === "beforeAdd" && args.data.ganttProperties.resourceInfo.length === 0) {
      args.cancel = true
      alert("Select Resource to Continue")
    }
    if (args.type == 'edit' || args.requestType == 'beforeOpenEditDialog') {
      ganttprogressValue = args.rowData.Progress;
      status = args.rowData.Status;
    } else if (args.taskBarEditAction == 'ProgressResizing') {
      ganttprogressValue = args.data.Progress;
      ganttisProgressResize = true
    }
    if (args.requestType == 'beforeSave' || args.requestType == 'beforeAdd') {
      if (args.data.Status === 'Open' && parseInt(args.data.Progress) !== 0) {
        args.data.Progress = 0
      }
      if (ganttprogressValue != args.data.Progress) {
        if (parseInt(args.data.Progress) == 100) {
          args.data.Status = 'Done';
          args.data.taskData.Status = 'Done';
        }
      }
      if (parseInt(args.data.Progress) != 0 && args.data.Status == "Open") {
        args.data.Status = 'InProgress';
        args.data.taskData.Status = 'InProgress';
      }
      if (parseInt(args.data.Progress) == 0 && args.data.Status != "Open") {
        args.data.Status = 'Open';
        args.data.taskData.Status = 'Open';
      }
      if (status != args.data.Status) {
        if (parseInt(args.data.Progress) < 100 && args.data.Status == "Done" && !ganttisProgressResize) {
          args.data.Progress = 100;
          args.data.taskData.Progress = 100;
          args.data.ganttProperties.progress = 100;
          updateDataSourceObject(
            gantt.current.dataSource,
            args.data.Id,
            { Progress: args.data.Progress, Status: args.data.Status }
          );
          setData(gantt.current.dataSource)
        }
      }
      if (ganttisProgressResize) {
        if (args.data.Progress < 100 && args.data.Status == "Done") {
          args.data.Status = 'InProgress';
          args.data.taskData.Status = 'InProgress';
        }
        ganttisProgressResize = false;
      }
    }
    if (args.requestType == 'beforeAdd') {
      storeNewRecord = args.data
      const projectValue = topDropDownInstance?.current.value as string | undefined;
      updateSprintData(projectValue, gantt, storeNewRecord);
    }
    if (
      args.requestType == 'beforeOpenEditDialog' ||
      args.requestType == 'beforeOpenAddDialog'
    ) {
      if (args.requestType == 'beforeOpenAddDialog') {
        const { newId, data } = calculateIdValueAndData();
        args.rowData.Id = newId
      }
      args.Resources.columns.splice(0, 1);
    }
  }
  const ganttactionComplete = (args: any) => {
    if (
      args.requestType == 'openEditDialog' ||
      args.requestType == 'openAddDialog'
    ) {
      let resources: any = args.data.ganttProperties.resourceInfo;
      let tabObj: any = (document.getElementById(gantt.current.element.id + '_Tab') as any)['ej2_instances'][0];
      tabObj.selected = function (args: any) {
        if (args.selectedIndex == 2) {
          let gridObj: any = (document.getElementById(gantt.current.element.id + 'ResourcesTabContainer_gridcontrol') as any)['ej2_instances'][0];
          gridObj.selectionSettings = {
            checkboxOnly: false,
            type: 'Single',
            persistSelection: false,
          };
          let currentViewData: any = gridObj.getCurrentViewRecords();
          let indexs: any = [];
          if (resources && resources.length > 0) {
            currentViewData.forEach(function (data: any, index: any) {
              for (let i = 0; i < resources.length; i++) {
                if (
                  data.taskData['resourceId'] ===
                  resources[i]['resourceId'] &&
                  gridObj.selectionModule &&
                  gridObj.getSelectedRowIndexes().indexOf(index) === -1
                ) {
                  indexs.push(index);
                }
              }
              gridObj.selectRows(indexs);
            });
          }
        }
      };
    }
    if (args.requestType == "save" || args.requestType == "add" || args.requestType == "delete") {
      if (args.requestType == "delete") {
        setData(gantt.current.dataSource)
      }
      updateCardValue(gantt.current.dataSource)
    }
  }

  const toolbar = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'];
  /// Kanban
  let priorityDataSource = [
    { name: 'Low', value: 'Low' },
    { name: 'Critical', value: 'Critical' },
    { name: 'Normal', value: 'Normal' },
    { name: 'High', value: 'High' },
  ];
  const swimlaneSettings = {
    keyField: 'resources'
  }
  const kanbancustomFn = (args: { [key: string]: string }): boolean | undefined => {
    let value: number = parseInt(args['value']);
    const kanbanStatusElement: any = document.getElementsByClassName('Status_wrapper')[0].querySelector('input');
    if (kanbanStatusElement.ej2_instances[0]) {
      if (kanbanStatusElement.ej2_instances[0].value === 'Done' && value < 100) {
        return false;
      } else {
        return true;
      }
    }
  };
  const kanbanStatuscustomFn = (args: { [key: string]: string }): boolean | undefined => {
    let value: any = args['value'];
    const progressElement: any = document.getElementsByClassName('Progress_wrapper')[0].querySelector('input');
    if (progressElement.ej2_instances[0]) {
      if (progressElement.ej2_instances[0].value === 100 && (value === "InProgress" || value === "Testing" || value ==="Open")) {
        return false;
      } else {
        return true;
      }
    }
  };
  const dialogSettings = {
    fields: [
      { key: 'Id', text: 'ID', type: 'TextBox' },
      { key: 'Subject', text: 'Subject', type: 'TextArea' },
      { key: 'Status', text: 'Status', type: 'DropDown', validationRules: { required: true, minLength: [kanbanStatuscustomFn, 'Only Done can be selected if the progress is 100'] } },
      { key: 'Progress', text: 'Progress', type: 'Numeric', validationRules: { required: true, minLength: [kanbancustomFn, 'Progress Cant be less than 100 if the status is in Done'] } },
      { key: 'StartTime', text: 'Start Time' },
      { key: 'EndTime', text: 'End Time' },
      { key: 'resources', text: 'Resources', validationRules: { required: true } },
      { key: 'Priority', text: 'Priority' }
    ],
  }
  const kanbanDataBound = (args: any): void => {
    if (isDataChanged && kanbanObj) {
      let updatedData: any[];
      if (Array.isArray(kanbanObj.current.dataSource)) {
        updatedData = kanbanObj.current.dataSource;
      } else if (kanbanObj.current.dataSource instanceof DataManager) {
        // Extract data from DataManager
        const dataManager: DataManager = kanbanObj.current.dataSource;
        updatedData = dataManager.dataSource.json as any[];
      } else {
        // Handle other cases, if necessary
        console.error('Unsupported dataSource type');
        return;
      }
      setData(updatedData);
      isDataChanged = false;
      if (isStatusChange) {
        updateCardValue(updatedData);
        isStatusChange = false;
      }
    }
    if (args.requestType === "cardCreated" && kanbanObj) {
      if (isStatusChange) {
        updateCardValue(kanbanObj.current.dataSource);
        const projectValue = topDropDownInstance?.current.value as string | undefined;
        updateSprintData(projectValue, kanbanObj, storeNewRecord);
        isStatusChange = false;
        kanbanObj.current.refresh();
      }
    }
  };
  function updateSprintData(projectValue:any, instance:any, storeNewRecord:any) {
    if (Array.isArray(instance.current.dataSource)) {
      switch (projectValue) {
        case 'Project1':
          window.sprintData1.push(storeNewRecord);
          break;
        case 'Project2':
          window.sprintData2.push(storeNewRecord);
          break;
        case 'Project3':
          window.sprintData3.push(storeNewRecord);
          break;
      }
      setData(instance.current.dataSource);
    } else if (instance.current.dataSource instanceof DataManager) {
      const dataManager = instance.current.dataSource;
      switch (projectValue) {
        case 'Project1':
          window.sprintData1 = dataManager.dataSource.json as any[];
          break;
        case 'Project2':
          window.sprintData2 = dataManager.dataSource.json as any[];
          break;
        case 'Project3':
          window.sprintData3 = dataManager.dataSource.json as any[];
          break;
      }
      setData(dataManager.dataSource.json as any[]);
    }
  }  
  const dialogClose = (args: any): void => {
    if (args.requestType === 'Edit' && args.name === 'dialogClose') {
      const newProgress = parseInt(args.data.Progress);
      if (args.data.Status === 'Open' && newProgress !== 0) {
        args.data.Progress = 0
      }
      if ((args.data.Status === 'Testing' || args.data.Status === 'InProgress') && (newProgress === 0 || newProgress === 100)) {
        args.data.Progress = 20
      }
      if (newProgress !== kanbanprogressValue) {
        if (newProgress === 100) {
          args.data.Status = 'Done';
        }
      }
      if (parseInt(args.data.Progress) !== 0 && args.data.Status === "Open") {
        args.data.Status = 'InProgress';
      }
      if (args.data.Progress === 0 && args.data.Status !== "Open") {
        args.data.Status = 'Open';
      }
      if (args.data.Status !== storeStatusValue) {
        isStatusChange = true;
      }
      if (status !== newProgress && newProgress < 100 && args.data.Status === 'Done') {
        args.data.Progress = 100;
      }
      const targetId = args.data.resources;
      const matchingResource = editingResources.find((resource: { resourceId: any; }) => resource.resourceId === targetId);
      if (matchingResource) {
        args.data.resources = matchingResource.resourceName;
      }
      isDataChanged = true;
    }
    if (args.requestType === 'Add') {
      const targetId = args.data.resources;
      const matchingResource = editingResources.find((resource: { resourceId: any; }) => resource.resourceId === targetId);
      if (matchingResource) {
        args.data.resources = matchingResource.resourceName;
      }
      storeNewRecord = args.data
    }
  };
  const getResourceObject = (resourceStr: any) => {
    return editingResources.find((resource: { resourceName: any; }) => resource.resourceName === resourceStr);
  }
  const dialogOpen = (args: any) => {
    const numericTextboxElement = document.getElementsByClassName("e-numerictextbox")[3] as HTMLElement;
    if (numericTextboxElement) {
      const ej2Instances = (numericTextboxElement as any).ej2_instances;
      if (ej2Instances && ej2Instances.length > 0) {
        ej2Instances[0].max = 100;
        ej2Instances[0].min = 0;
      }
    }

    const fields = args.element.querySelectorAll('.e-field');
    const isCorrectFields = (
      fields[4]?.getAttribute('name') === 'StartTime' &&
      fields[5]?.getAttribute('name') === 'EndTime' &&
      fields[6]?.getAttribute('name') === 'resources' &&
      fields[7]?.getAttribute('name') === 'Priority'
    );

    if (args.data && args.data.Status) {
      if (args.requestType === 'Edit') {
        storeStatusValue = args.data.Status;
      } else if (args.requestType === 'Add') {
        isStatusChange = true;
      }
    }
    let dateTimeInstance: any;
    let dateTimeInstance1: any;
    let resourceObject: any;
    if ((args.requestType === 'Add' || args.requestType === 'Edit') && isCorrectFields) {
      dateTimeInstance = new DateTimePicker({
        placeholder: "Select a date and time",
        value: args.requestType === 'Edit' ? args.data.StartTime : null
      });;
      dateTimeInstance.appendTo(fields[4] as HTMLInputElement);
      dateTimeInstance1 = new DateTimePicker({
        placeholder: "Select a date and time",
        value: args.requestType === 'Edit' ? args.data.EndTime : null
      });
      dateTimeInstance1.appendTo(fields[5] as HTMLInputElement);
      let resourceObject: any = getResourceObject(args.data.resources)
      const dropDownList = new DropDownList({
        dataSource: editingResources,
        fields: { text: 'resourceName', value: 'resourceId' },
        value: args.requestType === 'Edit' ? resourceObject.resourceId : null
      });
      dropDownList.appendTo(fields[6] as HTMLInputElement);
      const dropDownList1 = new DropDownList({
        dataSource: priorityDataSource,
        fields: { text: 'name', value: 'value' },
        value: args.requestType === 'Edit' ? args.data.Priority : null
      });
      dropDownList1.appendTo(fields[7] as HTMLInputElement);
    }
    if (args.requestType === 'Edit') {
      kanbanprogressValue = args.data.Progress;
      status = args.data.Status;
    }
  };
  const kanbanActionBegin = (args: any) => {
    if (args.requestType == 'cardChange') {
      if (args.changedRecords[0].Status == "Done") {
        args.changedRecords[0].Progress = 100
      }
      if (args.changedRecords[0].Status == "Open") {
        args.changedRecords[0].Progress = 0
      }
      if ((args.changedRecords[0].Status == "InProgress" || args.changedRecords[0].Status == "Testing")
        && (args.changedRecords[0].Progress === 0 || args.changedRecords[0].Progress === 100)) {
        args.changedRecords[0].Progress = 20
      }
      isDataChanged = true;
      if (storeStatusValue != args.changedRecords[0].Status) {
        isStatusChange = true;
      }
    }
  }
  ///// DataSource Dropdown
  const dataSourceFields = { text: 'Game', value: 'Id' }
  const change = (args: any) => {
    const selectedProject = args.itemData[dataSourceFields.value].toString();
    switch (selectedProject) {
      case 'Project1':
        filterAndUpdateData(window.sprintData1);
        scheduleObj.current.selectedDate = new Date(window.sprintData1[0].StartTime);
        break;

      case 'Project2':
        filterAndUpdateData(window.sprintData2);
        scheduleObj.current.selectedDate = new Date(window.sprintData2[0].StartTime);
        break;

      case 'Project3':
        filterAndUpdateData(window.sprintData3);
        scheduleObj.current.selectedDate = new Date(window.sprintData3[0].StartTime);
        break;
    }
  }
  ////// Date range component
  const timeStartDate = new Date(2021, 0, 1)
  const timeEndDate = new Date(2021, 0, 15)
  const timerangeChange = (args: any) => {
    const projectValue: string = topDropDownInstance.current.value;
    const resourceValue: any = resourceSelectValue;

    // Assuming sprintData is of type any
    const sprintData: any = (window as any)[`sprintData${projectValue.slice(-1)}`];

    const currentData: any[] = sprintData;

    const isDateRangeValid: boolean = args.text !== '';
    const matchedItems: any[] = currentData.filter((item: any) => {
      const itemStartDate: Date = new Date(item.StartTime);
      const itemEndDate: Date = new Date(item.EndTime);

      const dateMatch: boolean =
        !isDateRangeValid ||
        (itemStartDate >= args.startDate && itemEndDate <= args.endDate);

      return dateMatch;
    });

    if (resourceValue) {
      const resourceMatchedItems: any[] = resourceValue
        ? matchedItems.filter((item: any) => {
          return item.resources === resourceValue;
        })
        : matchedItems;

      updateCommonDataAndRefreshComponents(resourceMatchedItems);
    } else if (!resourceValue || resourceValue.length === 0) {
      updateCommonDataAndRefreshComponents(matchedItems);
    }
  };
  //// Button Component
  const idExistsInArray = (id: any, array: any[]) => {
    return array.some(obj => obj.Id === id);
  }
  const renderButton = () => {
    const { newId, data } = calculateIdValueAndData();
    data.Id = newId;
    let indexValue: any;
    const centeredDiv: HTMLDivElement | null = document.querySelector('.centered-div');
    if (centeredDiv) {
      let elements: any = centeredDiv.querySelectorAll('div');
      let parentDiv: any = [];
      elements.forEach(function (element: any) {
        if (element.className.includes("parent")) {
          parentDiv.push(element)
        }
      })
      elements = parentDiv
      elements.forEach(function (element: HTMLDivElement, index: number) {
        if (element.classList.contains('show1-background')) {
          indexValue = index
        }
      });
    }
    switch (indexValue) {
      case 0:
        kanbanObj.current.openDialog("Add", data)
        break;
      case 1:
        scheduleObj.current.openEditor(data, "Add")
        break;
      case 2:
        gantt.current.openAddDialog();
        break;
      case 3:
        gridObj.current.editSettings.mode = "Dialog"
        gridObj.current.editModule.addRecord();
        break;
    }
  };
  const calculateIdValueAndData = () => {
    const projectValue = topDropDownInstance.current.value as string;
    const projectData = (window as any)[`sprintData${+projectValue.charAt(projectValue.length - 1)}`];
    if (!projectData || projectData.length === 0) {
      return { newId: undefined, data: undefined }; // Return an object with undefined values
    }
    const data = { ...projectData[0] };
    let newId = projectData.length;
    do {
      newId++;
    } while (idExistsInArray(newId, projectData));
    return { newId, data }; // Return an object with newId and data properties
  }
  const renderButton1 = () => {
    const { newId, data } = calculateIdValueAndData();
    data.Id = newId;
    let indexValue: any;
    const centeredDiv: HTMLDivElement | null = document.querySelector('.mobile-nav-bar');
    if (centeredDiv) {
      let elements: NodeListOf<HTMLDivElement> = centeredDiv.querySelectorAll('div');
      let parentDiv: any = [];
      elements.forEach(function (element: any) {
        if (element.className.includes("parent")) {
          parentDiv.push(element)
        }
      })
      elements = parentDiv
      elements.forEach(function (element: HTMLDivElement, index: number) {
        if (element.classList.contains('show1-background')) {
          indexValue = index
        }
      });
    }
    switch (indexValue) {
      case 0:
        kanbanObj.current.openDialog("Add", data)
        break;
      case 1:
        scheduleObj.current.openEditor(data, "Add")
        break;
      case 2:
        gantt.current.openAddDialog();
        break;
      case 3:
        gridObj.current.editSettings.mode = "Dialog"
        gridObj.current.editModule.addRecord();
        break;
    }
  };
  ////// Grid Component
  const groupSettings = { showDropArea: false, captionTemplate: gridGroupTemplate.bind(this), columns: ['resources'] }
  const gridActionBegin = (args: any) => {
    if (args.requestType === 'beginEdit') {
      if (args.rowData.resources) {
        gridresource = args.rowData.resources;
        gridresourceObj = args.rowData.resources;
      }
    }
    if (args.requestType === 'save') {
      if (args.data.resources) {
        args.data.resources = args.data.resources
      }
      if (!args.data.Id) {
        if (Array.isArray(gridObj.current.dataSource)) {
          args.data.Id = gridObj.current.dataSource.length + 1
        }
      }
      if (!args.data.resources) {
        args.data.resources = gridresourceObj;
      }
      if (args.data.Status === 'Open' && parseInt(args.data.Progress) != 0) {
        args.data.Progress = 0
      }
      if ((args.data.Status === 'InProgress' || args.data.Status === 'Testing') && (parseInt(args.data.Progress) === 0 || parseInt(args.data.Progress) === 100)) {
        args.data.Progress = 20
      }
      if (parseInt(args.data.Progress) === 100) {
        args.data.Status = 'Done';
      }
      if (parseInt(args.data.Progress) < 100 && args.data.Status === "Done") {
        args.data.Progress = 100
      }
      if (parseInt(args.data.Progress) !== 0 && args.data.Status === "Open") {
        args.data.Status = 'InProgress';
      }
      if (parseInt(args.data.Progress) === 0 && args.data.Status !== "Open") {
        args.data.Status = 'Open';
      }
      storeNewRecord = args.data
      const projectValue = topDropDownInstance?.current.value as string | undefined;
      if (args.action == 'add') {
        updateSprintData(projectValue, gridObj, storeNewRecord);
      }
      updateDataSourceObject(
        gridObj.current.dataSource,
        args.data.Id,
        args.data
      );
      setData(gridObj.current.dataSource)
      setTimeout(function () {
        gridObj.current.refresh();
      }, 100);
    }
  }
  const gridDataBound = (args: any) => {
    updateCardValue(gridObj.current.dataSource)
  }
  const gridToolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel']
  const gridEditSettings = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    newRowPosition: 'Top',
    mode: 'Dialog'
  }
  let gridStatusDropDown = {
    create: () => {
      gridstatuselem = document.createElement('input');
      return gridstatuselem;
    },
    read: () => {
      return gridstatusdropdownlistObj.value;
    },
    destroy: () => {
      gridstatusdropdownlistObj.destroy();
    },
    write: (args: any) => {
      gridstatusdropdownlistObj = new DropDownList({
        dataSource: [
          { Status: 'Open' },
          { Status: 'Testing' },
          { Status: 'InProgress' },
          { Status: 'Done' },
        ],
        fields: { value: 'Status' },
        placeholder: "Status",
        value: args.rowData[args.column.field],
        floatLabelType: 'Auto',
      });
      gridstatusdropdownlistObj.appendTo(gridstatuselem);
    },
  }
  let gridPriorityDropDown = {
    create: () => {
      gridpriorityelem = document.createElement('input');
      return gridpriorityelem;
    },
    read: () => {
      return gridprioritydropdownlistObj.value;
    },
    destroy: () => {
      gridprioritydropdownlistObj.destroy();
    },
    write: (args: any) => {
      gridprioritydropdownlistObj = new DropDownList({
        dataSource: [
          { Priority: 'Low' },
          { Priority: 'Normal' },
          { Priority: 'Critical' },
          { Priority: 'High' },
        ],
        fields: { value: 'Priority' },
        placeholder: "Priority",
        value: args.rowData[args.column.field],
        floatLabelType: 'Auto',
      });
      gridprioritydropdownlistObj.appendTo(gridpriorityelem);
    },
  }
  
  //// Schedule component

  const scheduleSelectedDate = new Date(2021, 0, 1)
  const scheduleeventSettings = { dataSource: data }
  const schedulepopupOpen = (args: any) => {
    if (args.type === 'Editor') {
      storeScheduleEditID = args.data.Id
      scheduleprogressValue = args.data.Progress;
      status = args.data.Status
      // Create required custom elements in initial time
      let formElement = args.element.querySelector('.e-schedule-form');
      if (formElement && !formElement.querySelector('.custom-field-row')) {
        let row = document.createElement('div');
        row.className = 'custom-field-row';

        // Create a label for the input element
        let label = document.createElement('label');
        label.textContent = 'Status';

        // Remove font-weight styles from the label
        label.style.fontWeight = 'normal'; // Or 'unset'

        let container = document.createElement('div');
        container.className = 'custom-field-container';

        let inputEle = document.createElement('input');
        inputEle.className = 'e-field';
        inputEle.name = 'Status';
        container.appendChild(inputEle);
        row.appendChild(label); // Append the label
        row.appendChild(container);
        let errorMessage = document.createElement('span');
        errorMessage.className = 'error-message';
        errorMessage.style.color = 'red';
        errorMessage.style.display = 'none'; 
        errorMessage.textContent = 'Only Done can be selected if the progress is 100';
      //  errorMessage.style.display = 'block';
        row.appendChild(errorMessage);
        formElement.insertBefore(row, formElement.firstChild);
        const buttonElement = document.querySelector('.e-schedule-dialog.e-control.e-btn.e-lib.e-primary.e-event-save.e-flat') as HTMLButtonElement;
        let dropDownList = new DropDownList({
          dataSource: [
            { text: 'Open', value: 'Open' },
            { text: 'Testing', value: 'Testing' },
            { text: 'InProgress', value: 'InProgress' },
            { text: 'Done', value: 'Done' },
          ],
          fields: { text: 'text', value: 'value' },
          change:function(args) {
            let targetElement: any | null = document.getElementsByClassName("e-field")[0];
            if (args.value != 'Done' && parseInt(targetElement.value) === 100) {
              errorMessage.style.display = 'block'; 
              buttonElement.disabled = true;
              return
            } else {
              errorMessage.style.display = 'none';
              buttonElement.disabled = false; 
            }
            if (targetElement && targetElement.name == 'Progress') {
              const event = new Event('focusout', { bubbles: true });
              targetElement.dispatchEvent(event);
            }
          },
          value: args.data.Status,
        });

        dropDownList.appendTo(inputEle);
      }
      if (formElement && !formElement.querySelector('.custom-field-row-priority')) {
        let row = document.createElement('div');
        row.className = 'custom-field-row-priority';

        // Create a label for the input element
        let label = document.createElement('label');
        label.textContent = 'Priority';

        // Remove font-weight styles from the label
        label.style.fontWeight = 'normal'; // Or 'unset'

        let container = document.createElement('div');
        container.className = 'custom-field-priority';

        let inputEle = document.createElement('input');
        inputEle.className = 'e-field';
        inputEle.name = 'Priority';

        container.appendChild(inputEle);
        row.appendChild(label); // Append the label
        row.appendChild(container);

        formElement.insertBefore(row, formElement.firstChild);

        let dropDownList = new DropDownList({
          dataSource: [
            { text: 'Low', value: 'Low' },
            { text: 'Normal', value: 'Normal' },
            { text: 'Critical', value: 'Critical' },
            { text: 'High', value: 'High' },
          ],
          fields: { text: 'text', value: 'value' },
          value: args.data.Priority,
        });

        dropDownList.appendTo(inputEle);
      }
      if (
        formElement &&
        !formElement.querySelector('.custom-field-row-progress')
      ) {
        let row = document.createElement('div');
        row.className = 'custom-field-row-progress';
        row.style.paddingBottom = '10px';

        // Create a label for the header text
        let headerLabel = document.createElement('label');
        headerLabel.textContent = 'Progress';

        // Remove font-weight styles from the label
        headerLabel.style.fontWeight = 'normal'; // Or 'unset'

        let container = document.createElement('div');
        container.className = 'custom-field-progress';

        let inputEle = document.createElement('input');
        inputEle.className = 'e-field';
        inputEle.name = 'Progress';

        // Set the type to "number" to create a numeric input
        inputEle.type = 'number';
        inputEle.style.width = '100%';
        inputEle.max = "100";
        inputEle.min = "0";
        let errorMessage = document.createElement('span');
        errorMessage.className = 'error-message';
        errorMessage.style.color = 'red';
        errorMessage.style.display = 'none'; // Initially hide the error message
        inputEle.addEventListener('focusout', function (event) {
          const schedulerStatusElement: any = document.getElementsByClassName('custom-field-row')[0].querySelector('input')
          const buttonElement = document.querySelector('.e-schedule-dialog.e-control.e-btn.e-lib.e-primary.e-event-save.e-flat') as HTMLButtonElement;
          let enteredValue = parseInt(inputEle.value, 10);
          if (enteredValue < 0) {
            inputEle.value = '0'; // Set value as string '0'
          }
          if (enteredValue > 100) {
            inputEle.value = '100';
          }
          if (schedulerStatusElement.ej2_instances[0].value === "Done" && enteredValue < 100) {
            errorMessage.textContent = 'Progress Cant be less than 100 if the status is in Done';
            errorMessage.style.display = 'block';
            (event.currentTarget as HTMLElement).style.borderColor = 'red';
            buttonElement.disabled = true;
          } else {
            errorMessage.style.display = 'none';
            (event.currentTarget as HTMLElement).style.borderColor = '';
            buttonElement.disabled = false;
          }
        });
        inputEle.value = args.data.Progress;
        container.appendChild(inputEle);
        row.appendChild(headerLabel);
        row.appendChild(container);
        row.appendChild(errorMessage);
        formElement.insertBefore(row, formElement.firstChild);
      }
    }
  }
  const scheduleactionBegin = (args: any) => {
    if (args.requestType === 'eventCreate') {

      if (args.data[0].resources) {
        const foundObject: any = editingResources.find((obj: { resourceName: any; }) => obj.resourceName === args.data[0].resources);
        args.data[0].resources = foundObject.resourceName
      }
    }
    if (args.requestType === 'eventChange') {
      if (args.data.resources) {
        const foundObject: any = editingResources.find((obj: { resourceName: any; }) => obj.resourceName === args.data.resources);
        args.data.resources = foundObject.resourceName
      }
      if (args.data.Status === "Open" && parseInt(args.data.Progress) !== 0) {
        args.data.Progress = 0
      }
      if ((args.data.Status === "InProgress" || args.data.Status === "Testing") && (parseInt(args.data.Progress) === 0 || parseInt(args.data.Progress) === 100)) {
        args.data.Progress = 20
      }
      if (scheduleprogressValue !== parseInt(args.data.Progress)) {
        if (parseInt(args.data.Progress) === 100) {
          args.data.Status = 'Done';
        }
      }
      if (status !== args.data.Status) {
        if (args.data.Progress < 100 && args.data.Status === "Done") {
          args.data.Progress = 100
        }
      }
      if (parseInt(args.data.Progress) !== 0 && args.data.Status === "Open") {
        args.data.Status = 'InProgress';
      }
      if (parseInt(args.data.Progress) === 0 && args.data.Status !== "Open") {
        args.data.Status = 'Open';
      }
      if (Array.isArray(scheduleObj.current.eventSettings.dataSource)) {
        const dataSource = scheduleObj.current.eventSettings.dataSource;
        const idToMatch = storeScheduleEditID;
        dataSource.forEach((item: { Id: any; }) => {
          if (item.Id === idToMatch) {
            item = args.data;
            item.Id = idToMatch;
            return
          }
        });
      }
    }
  }
  const scheduleactionComplete = (args: any) => {
    if (args.requestType !== 'toolBarItemRendered') {
      setTimeout(() => {
        scheduleObj.current.refresh();
      }, 0);
    }
  }
  const scheduledataBound = (args: any) => {
    updateCardValue(scheduleObj.current.eventSettings.dataSource)
  }
  const schedulegroup = {
    resources: ['Projects', 'Categories'],
  }
  const scheduleresources = [
    {
      field: 'resources',
      title: 'Resources',
      name: 'Projects',
      dataSource: editingResources,
      textField: 'resourceName',
      idField: 'resourceName',
    },
    {
      field: 'Id',
      title: 'Category',
      name: 'Categories',
      //  allowMultiple: true,
      dataSource: data,
      textField: 'Subject',
      idField: 'Id',
      groupIDField: 'resources',
    },
  ]
  const containerStyle = {
    border: '1px solid #cfd8dc',
    backgroundColor: '#ffffff',
    borderRadius: '5px',
  };
  return (
    <div>
      <div className="create-container" style={{ overflow: 'auto' }}>
        <div className="nav-bar">
          <div>
            <div className="first-nav-div"></div>
          </div>
          <div className="centered-div">
            <div className="parent-kanban" title="Kanban">
              <div className="navimage-kanban"></div>
            </div>
            <div className="parent-scheduler" title="Scheduler">
              <div className="navimage-scheduler"></div>
            </div>
            <div className="parent-gantt" title="Gantt Chart">
              <div className="navimage-gantt"></div>
            </div>
            <div className="parent-grid" title="Grid">
              <div className="navimage-grid"></div>
            </div>
          </div>
          <div>
            <div className="last-nav-div"></div>
          </div>
        </div>
        <div className="main-content">
          <div className="title-container">
            <div className="extra-circle"></div>
            <div className="title">Sprint Management</div>
            <button className="button" onClick={renderButton}>+ New Task</button>
            <div className="circle"></div>
          </div>
          <div className="datasource-filter-container">
            <div className="card-container">
              <div className="inner-cadr">
                <div className="mainimagetodo"></div>
                <div className="detailcontainertodo">
                  <div className="texttodo">TO DO</div>
                  <div className="counttodo">0</div>
                </div>
              </div>
              <div className="inner-cadr">
                <div className="mainimageprogress"></div>
                <div className="detailcontainertodo">
                  <div className="texttodo change-font">In Progress</div>
                  <div className="counttodo">0</div>
                </div>
              </div>
              <div className="inner-cadr">
                <div className="mainimagetest"></div>
                <div className="detailcontainertodo">
                  <div className="texttodo">Testing</div>
                  <div className="counttodo">0</div>
                </div>
              </div>
              <div className="inner-cadr">
                <div className="mainimagedone"></div>
                <div className="detailcontainertodo">
                  <div className="texttodo">Done</div>
                  <div className="counttodo">0</div>
                </div>
              </div>
            </div>
            <div className="dropdown-container">
              <DropDownListComponent id="datasourceDropDown" className="custom-dropdown" ref={topDropDownInstance} dataSource={changeDataSource} fields={dataSourceFields} placeholder="Select a Project" value={'Project1'} width="200px" popupHeight="220px" change={change.bind(this)} />
              <div id="image-container" className="custom-dropdown">
                <img src="https://ej2.syncfusion.com/demos/src/gantt/images/Martin%20Tamer.png" alt="Martin Tamer" className="circular-image" title="Martin Tamer" style={{ width: '35px', height: '35px' }} />
                <img src="https://ej2.syncfusion.com/demos/src/gantt/images/Rose%20Fuller.png" alt="Rose Fuller" className="circular-image" title="Rose Fuller" style={{ width: '35px', height: '35px' }} />
                <img src="https://ej2.syncfusion.com/demos/src/gantt/images/Margaret%20Buchanan.png" alt="Margaret Buchanan" className="circular-image" title="Margaret Buchanan" style={{ width: '35px', height: '35px' }} />
                <img src="https://ej2.syncfusion.com/demos/src/gantt/images/Fuller%20King.png" alt="Fuller King" className="circular-image" title="Fuller King" style={{ width: '35px', height: '35px' }} />
                <img src="https://ej2.syncfusion.com/demos/src/gantt/images/Davolio%20Fuller.png" alt="Davolio Fuller" className="circular-image" title="Davolio Fuller" style={{ width: '35px', height: '35px' }} />
              </div>
              <div id="timerangecompo" className="custom-dropdown">
                <DateRangePickerComponent id="timerangecompo1" width="200px" ref={dateRangeInstance} startDate={timeStartDate} endDate={timeEndDate} change={timerangeChange.bind(this)}></DateRangePickerComponent>
              </div>
            </div>
          </div>
          <div className="component-contain add-overflow" style={containerStyle}>
            <KanbanComponent id="component-renderf" className="component-container1" keyField="Status" enableTooltip={true} ref={kanbanObj} dialogSettings={dialogSettings} cssClass={"kanban-overview"} dataSource={data} swimlaneSettings={swimlaneSettings} cardRendered={cardRendered.bind(this)} dataBound={kanbanDataBound.bind(this)} dialogClose={dialogClose.bind(this)} dialogOpen={dialogOpen.bind(this)} actionBegin={kanbanActionBegin.bind(this)} cardSettings={{
              headerField: 'Id',
              template: (props: any) => <CardTemplate {...props} />
            }} height="100%">
              <KanbanColumnsDirective>
                <KanbanColumnDirective
                  headerText="To Do"
                  keyField="Open"
                  template={(props: any) => <KanbanTemplate {...props} headerText="To Do" />}
                />
                <KanbanColumnDirective
                  headerText="In Progress"
                  keyField="InProgress"
                  template={(props: any) => <KanbanTemplate {...props} headerText="In Progress" />}
                />
                <KanbanColumnDirective
                  headerText="Testing"
                  keyField="Testing"
                  template={(props: any) => <KanbanTemplate {...props} headerText="Testing" />}
                />
                <KanbanColumnDirective
                  headerText="Done"
                  keyField="Done"
                  template={(props: any) => <KanbanTemplate {...props} headerText="Done" />}
                />
              </KanbanColumnsDirective>
            </KanbanComponent>
            <ScheduleComponent id="component-render-scheduler" className="component-container1" ref={scheduleObj} selectedDate={scheduleSelectedDate} eventSettings={scheduleeventSettings} popupOpen={schedulepopupOpen.bind(this)} eventRendered={(args: any) => scheduleeventRendered(args, scheduleObj)} actionBegin={scheduleactionBegin.bind(this)} actionComplete={scheduleactionComplete.bind(this)} dataBound={scheduledataBound.bind(this)} group={schedulegroup} resources={scheduleresources} currentView='TimelineMonth' height='100%' showQuickInfo={false}>
              <ViewsDirective>
                <ViewDirective option='TimelineDay' />
                <ViewDirective option='TimelineWeek' />
                <ViewDirective option='TimelineWorkWeek' />
                <ViewDirective option='TimelineMonth' />
                <ViewDirective option='Agenda' />
              </ViewsDirective>
              <SchedulerInject services={[Day, Week, WorkWeek, Month, Year, Agenda, TimelineViews, TimelineMonth, TimelineYear, DragAndDrop, Resize, ExcelExport, ICalendarExport, ICalendarImport, Print]} />
            </ScheduleComponent>
            <GanttComponent id="component-render-gantt" className="component-container1" dataSource={data} ref={gantt} treeColumnIndex={1} viewType={"ResourceView"} collapseAllParentTasks={false} taskFields={taskFields} toolbar={toolbar} dataBound={ganttdataBound.bind(this)} editSettings={editSettings} queryTaskbarInfo={queryTaskbarInfo.bind(this)} resourceFields={resourceFields} resources={editingResources} columns={ganttcolumns} actionBegin={ganttactionBegin.bind(this)} actionComplete={ganttactionComplete.bind(this)} rowHeight={60} height='100%'>
              <Inject services={[Edit, Selection, Toolbar, DayMarkers]} />
            </GanttComponent>
            <GridComponent id="component-render-grid" className="component-container1" ref={gridObj} dataSource={data} allowGrouping={true}
              groupSettings={groupSettings} actionBegin={gridActionBegin.bind(this)} dataBound={gridDataBound.bind(this)} toolbar={gridToolbar} editSettings={gridEditSettings} height="100%">
              <GridColumnsDirective>
                <GridColumnDirective field='Id' allowEditing={true} isPrimaryKey={true}></GridColumnDirective>
                <GridColumnDirective field='Subject' width='350px'></GridColumnDirective>
                <GridColumnDirective field='StartTime' headerText='Start Time' editType='datetimepickeredit' valueAccessor={startdateValueAccessor}></GridColumnDirective>
                <GridColumnDirective field='EndTime' headerText='End Time' editType='datetimepickeredit' valueAccessor={enddateValueAccessor}></GridColumnDirective>
                <GridColumnDirective
                  field='Progress'
                  editType='numericedit'
                  edit={{
                    params: {
                      min: 0,
                      max: 100
                    }
                  }}
                  validationRules={{
                    required: true,
                    minLength: [gridcustomFn, 'Progress Cant be less than 100 if the status is in Done']
                  }}
                ></GridColumnDirective>
                <GridColumnDirective field='Status' edit={gridStatusDropDown}
                  validationRules={{
                    required: true,
                    minLength: [gridStatusCustomFn, 'Only Done can be selected if the progress is 100']
                  }}
                ></GridColumnDirective>
                <GridColumnDirective field='Priority' edit={gridPriorityDropDown}></GridColumnDirective>
                <GridColumnDirective
                  field='resources'
                  headerText='Resources'
                  validationRules={{ required: true }}
                  valueAccessor={resourceValueAccessor}
                  enableGroupByFormat={true}
                  edit={{
                    create: () => {
                      gridresourceelem = document.createElement('input');
                      return gridresourceelem;
                    },
                    read: () => {
                      const selectedValue = gridresourcedropdownlistObj.value;
                      const matchingResource = editingResources.find(
                        (resource: { resourceId: any; }) => resource.resourceId === selectedValue
                      );

                      if (matchingResource) {
                        return matchingResource.resourceName; // Return the matching object as an array
                      }

                      return null; // Return null if no matching object is found
                    },
                    destroy: () => {
                      gridresourcedropdownlistObj.destroy();
                    },
                    write: (args: any) => {
                      let valueToSet = args.rowData && args.rowData[args.column.field] ? args.rowData[args.column.field] : null;
                      editingResources.forEach((obj: { resourceName: any; resourceId: any; }) => {
                        if (obj.resourceName === valueToSet) {
                          valueToSet = obj.resourceId
                          return
                        }
                      });
                      gridresourcedropdownlistObj = new DropDownList({
                        dataSource: editingResources,
                        fields: { text: 'resourceName', value: 'resourceId' },
                        value: valueToSet,
                        placeholder: "Resource",
                        floatLabelType: 'Auto',
                      });
                      gridresourcedropdownlistObj.appendTo(gridresourceelem);
                    },
                  }}
                ></GridColumnDirective>
              </GridColumnsDirective>
              <GridInject services={[Page, GridEdit, GridToolbar, Group]} />
            </GridComponent>
          </div>
        </div>
      </div>

      {/* Mobile View Navigation Bar */}
      <div className="mobile-nav-bar">
        <div className="parent-kanban">
          <div className="navimage-kanban"></div>
        </div>
        <div className="parent-scheduler">
          <div className="navimage-scheduler"></div>
        </div>
        <div className="parent-gantt">
          <div className="navimage-gantt"></div>
        </div>
        <div className="parent-grid">
          <div className="navimage-grid"></div>
        </div>
      </div>

      {/* New div for mobile view */}
      <div className="custom-div1" onClick={renderButton1}></div>
    </div>
  )
}
