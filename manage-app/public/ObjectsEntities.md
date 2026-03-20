Objects/Entities:

-----------------



Asset Classes: Determine to which level an asset belongs, who has the initial read/write abilities, etc. (All class defined assets may be shared to other entities)

* User Class: Any user defined objects are only defined and seen by that user (usually overwritten by either the department or organization so the user can't create "hidden" objects)
* Department Class: All defined objects are kept in this department/group and only accessible to those who are a part of the group.
* Organization Class: The top, broad most class. Further allows encapsulation so department classes don't have to share all data/information allowing for clean and concise dashboards



Roles: (Roles will be user defined except...)

* Executive: Has access to all classes
* Freelance: A temporary role able to contribute to existing things, but not create. All actions must be done in department scope so nothing is hidden personally.
* Admin: Flag top put on a role for delegation of user assignment tasks.



---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



Entities:

-------------------------------------

User:

* name:
* username:
* password:
* payment?: personal plan, organizations plan
* role:
* id: Unique ID



Department/Group:

* name:
* utilities: {"charts", "calendar", etc.}
* users | roles: {group of users or group of rules (to group multiple users)}
* id: Unique ID



Organization:

* name:
* departments/groups: {sales, education, technology, janitorial, etc.}
* payment?: set plans - enterprise/contact
* id: Unique ID





Objects:

-------------------------------------

Charts:

* Name:
* id: Unique ID
* data\[x]:
* labels:
* colors:
* type: line, doughnut, pie, bar, area
* etc.



To-Do Note:

* id: Unique ID
* name:
* msg <string | bullet>:



Calendar:

* date:
* note:
* notification config:



Projects:

* name:
* id:
* asset/role association:
* charts: \[list]
