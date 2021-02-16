# AdapTable OpenFin Demo

<img src="./demo.jpg"  >

## Overview

This demo application illustrates how [Adaptable](https://adaptabletools.com) and [OpenFin](https://openfin.co/) combine neatly together to provide powerful, cutting-edge, feature-rich applications.
      
It uses **dummy data** to mimic the types of screens, workflows and advanced use-cases typically found in Financial Services systems.

> The demo application is not designed to be used 'off the shelf' but as an example of the functionality contained in AdapTable and OpenFin, and how they can work together to produce cutting edge excel-managemennt, notification and other benefits.
        
The demo took less than a day to develop and uses a small subset of the many, exceptional features found in both AdapTable and OpenFin.

## How it Works
       
The Demo Application - built using AdapTable's [OpenFin Plugin](https://docs.adaptabletools.com/docs/plugins/openfin/openfin-plugin) - displays a pseudo Front Office set-up with 3 views: Trade, Price and Positions.
        
Each screen is an OpenFin application which shows 'ticking' data, and each updates based on ticking data upates and data changes made in the other screens.

> These are OpenFin windows so they can be dragged, tiled and grouped as each user prefers.

The 3 blotters are:

### 1. Trade Blotter
- Displays a collection of fictitous Trades (25 at startup), each of which has an *InstrumentId* and a Status (of active or inactive)
- Every 10 seconds a new trade is added to the dummy data and displayed in the Grid
- Editable columns are: Trade Status, Notional (is this correct?)

### 2. Price Blotter
- Displays a made-up list of *Instruments*, each of which contains a Price
- Every x seconds the Price is updated (and flashes accordingly)
- Each entry also contains a Closing Price, Spread and Bid and Ask
- Editable columns are: Price, BidOfferSpread (is this correct?)
### 3. Positions Blotter
- Displays the position for each *InstrumentId* based on data from the Trade and Price screens
- Each row aggregates all the trades for an <i>InstrumentId</i> and calculates the PnL based on the current Price
- Each time a Trade is added or a Price changes, the Positions Blotter will update (via the OpenFin xxx)
- No columns are editable

## Application Bar
At the top of the demo are a series of useful buttons and dropdowns which help to manage and sync the various the windows.  It includes:
- Instrument Picker: Selecting an Instrument from the dropdown will ****????.  This will cause each of the 3 blotters to filter to that Instrument and also????
  
- Channel Chooser - allows the user to pick a channel on which FDC3 messages will be broadcast

- Theme Button - will toggle the [Adaptable Theme](https://docs.adaptabletools.com/docs/adaptable-functions/theme-function) in all the Blotters between white and dark themes.

    > The same effect can be achieved by changing the theme in any of the individual Blotters

- Button to toggle pausing / displaying OpenFin notifications

- Button to hide / show the Sidebar

## Audit Screens
The Demo leverages the powerful [AdapTable Audit Log](https://docs.adaptabletools.com/docs/key-topics/audit-log) to provide a live 'view' of all data changes. 
 
There are 2 Audit Screens - each of which listens to the Audit Log stream and outputs to a new window:
- **Trade Audit**: Displays a list of all Cell Edits made in the Trade Blotter - who made the change, what was changed and when
- **Price Blotter**: Displays a list of all Cell Edits made in the Price Blotter but also logs Ticking Data changes

##  Sidebar 
A sidebar is displayed on the left of the application giving access to all the screens available in the demo

> This can be hidden / displayed via a button in the Application Toolbar

## Notifications and Alerts
The Positions Blotter has been set up to fire an [Adaptable Alert](https://docs.adaptabletools.com/docs/adaptable-functions/alert-function) when any Position is greater than 50,000.

The Alert has been configured with the *ShowInOpenFin* property set to true (something only available when running in the OpenFin container).

The result is that the Alert is displayed as an [OpenFin Notification](https://www.npmjs.com/package/openfin-notifications) and appears at the side of the grid when triggered.

The Notification has been designed with 2 action buttons. In each case we handle the button click event and access the AdapTable API to peform a relevant task:
- **Increase Limit**: This will add 1,000 to the amount that the Position must be before it is triggered. (Note how after clicking this button, next time the Alert fires it shows the updated limit as its trigger.)

- **Show Me**: This will highlight the Cell that triggered the Alert and also make the grid 'jump' to show that cell if it was not already in view.

## Live Export
AdapTable ships with many compelling, extra features, only available when it is running in the OpenFin container.

One of these is 2-way Live Export - whereby grid data can be sent from AdapTable to Excel with the following features:

- Excel will automatically update in line with cell edits and ticking data changes in AdapTable

- Any date edits made directly in Excel will be automatically reflected in AdapTable
  
- Any [Cell Validation Rules](https://docs.adaptabletools.com/docs/adaptable-functions/cell-validation-function) created in AdapTable will be invoked when data in Excel is edited which breaks a rule.  
  
  > When that happens an OpenFin Notification will popup giving details of the validation rule and an Action Button to undo the edit

This can be achieved by selecting a report from the **OpenFin Toolbar** in the Trades [Dashboard](https://docs.adaptabletools.com/docs/user-interface/dashboard) and running Live Update (the triangular buttton).
       
## AdapTable Features

There are numerous [AdapTable Functions](https://docs.adaptabletools.com/docs/adaptable-functions/adaptable-functions-overview) being used in this demo to enhance the workflow and improve the user experience.
> These have been configured at design-time through [Predefined Config](https://docs.adaptabletools.com/docs/predefined-config/predefined-config-overview), but they can, instead, be created at run-time via the AdapTable UI (or programmatically through the Adaptable API).

Some of the Functions being used are: 
### [Dashboard](https://docs.adaptabletools.com/docs/user-interface/dashboard) 
Set up as follows:
- Trade View - Two Tabs - *Blotter* and *Reports* (each with own set of Toolbars)
- Position and Price Views - a single Tab with a different set of Toolbars
- Position and Price Views - configued so Dashboard is in 'Collapsed' mode at startup

### [Alert](https://docs.adaptabletools.com/docs/adaptable-functions/alert-function) 
An Alert (of type 'Warning') has been configured in Position View to fire when Position Coumn value > 50,000 - will trigger an OpenFin Notification

### [Conditional Style](https://docs.adaptabletools.com/docs/adaptable-functions/conditional-style-function) 
The following Conditional Styles have been set up:
  - Trade View - Styles the whole Row light yellow where 'Status' column value is 'active'
  - Price View - 2 Styles for 'Change of Day' column: green background for positive values and red background for negative values
  - Position View - 'PnL' column displays a green or red font for positive and negative numbers

### [Calculated Column](https://docs.adaptabletools.com/docs/adaptable-functions/calculated-column-function) 
3 set up in Price View:
  - **Bid**: Created with Expression: '[price] - [bidOfferSpread] / 2'
  - **Ask**: Created with Expression: '[price] + [bidOfferSpread] / 2' 
  - **Change on Day**: Created with Expression: '[price] - [closingPrice]'
                  
### [Format Column](https://docs.adaptabletools.com/docs/adaptable-functions/format-column-function) 
configured as follows:
- Trade View: All Date Columns (Trade Date, Settlement Date, LastUpdated) use a Date Format of 'MM/DD/YYYY'
- Price View: 'Bid', 'Ask', 'Change On Day', and 'Price' have a Display Format of 4 decimal places and cell aligns right
- Position View: 'Current Price', 'Closing Price' and 'PnL' have Display Format of 4 decimal places; 'PnL' also has negative numbers in parentheses
              
### [Flashing Cell](https://docs.adaptabletools.com/docs/adaptable-functions/flashing-cell-function) 
set up as follows:
  - Price View: 'Bid', 'Ask', and 'Price' all have Flashing Cells set (to Green and Red)
  - Position View: 'Position' has Flashing Cells set (to Green and Red)

### [Plus Minus](https://docs.adaptabletools.com/docs/adaptable-functions/plus-minus-function) - 
Price View contains 2 Plus / Minus Rules for the 'Bid Offer Spread' column:
  - Default Nudge value of 0.5 - how cells in Column will increment / decrement when the '+' or '-' keys are pressed
  - A Custom Plus Minus Rule which specifies that if the *InstrumentId* is 'AAPL', the cell will nudge instead by 1
  
### [Layout](https://docs.adaptabletools.com/docs/adaptable-functions/layout-function) 
Trade View contains 2 Layouts:
  - 'Latest Trades' - shows all Columns ordered by Trade Id in descending order
  - 'Counterparties' - shows subset of Columns grouped by Counterparty (and with notional aggregated)

### [Export](https://docs.adaptabletools.com/docs/adaptable-functions/export-function) 
Trade View contains an 'Active Trades' Report which;
  - exports All Columns and any Rows where Status is 'Active'
  - is also available in the OpenFin Toolbar and so can be exported to Excel as a "Live Report (which will update in real time).

### [Edit Lookup](https://docs.adaptabletools.com/docs/predefined-config/user-interface-config#editlookupitems) 
An EditLookUp Item has been added to 'Status' column in Trade View to enable quick editing
              
### [Action Column](https://docs.adaptabletools.com/docs/adaptable-functions/action-column-function)
An Action Column has been added to the Trade View which displays a 'Cancel' button in any row where Status is 'active'.  When clicked it changes the Status to 'inactive'.

### [User Menu Items](https://demo.adaptabletools.com/menus)
All 3 views have 2 menu items which when clicked will broadcast the Instrument via an FDC3 message:
- 'Broadcast [Instrument Name]' [Context Menu](https://docs.adaptabletools.com/docs/user-interface/context-menu) Item which appears only when right-clicking in a cell in Instrument
- 'Broadcast' [Column Menu](https://docs.adaptabletools.com/docs/user-interface/column-menu/) Item which appears only in Instrument Column Menu


## Installation

NOTE: In order to be able to run `npm install`, you need first to be logged into our private NPM registry - follow the instructions in the [Adaptable Documentation](https://docs.adaptabletools.com/docs/getting-started/installationn)

> If you do not have an Adpatable Login please contact support@adaptabletools.com

Run `npm install` (or `yarn`), depending on what tool you're using.

### Running in dev

```sh
$  npm run dev
```

and

```sh
$  npm run dev-openfin
```

## Running in production

If you want to run the live app just run the command below on a Windows machine

```sh
$ npx openfin-cli --launch --config https://openfin-demo.adaptabletools.com/openfin-app.json
```

This will launch the OpenFin runtime and open the AdapTable demo for you.




## Licences
A licence for AdapTable provides access to all product features as well as quarterly updates and enhancements through the lifetime of the licence, comprehensive support, and access to all 3rd party libraries.

Licences can be purchased individually, for a team (minimum 30 end-users), for an organisation or for integration into software for onward sale.

We can make a trial licence available for a short period of time to allow you to try out AdapTable for yourself.

Please contact [`sales@adaptabletools.com`](mailto:sales@adaptabletools.com) for more information.

## More Information

- For general information about Adaptable Tools is available at our [Website](http://www.adaptabletools.com) 

- To see AdapTable in action visit our [Demo Site](https://demo.adaptabletools.com) which contains large number of AdapTable demos each showing a different feature, function or option in AdapTable (using dummy data sets).

- Developers can learn how to access AdapTable programmatically at [AdapTable Documentation](https://docs.adaptabletools.com).

- For all support enquiries please email [`support@adaptabletools.com`](mailto:support@adaptabletools.com) or [raise a Support Ticket](https://adaptabletools.zendesk.com/hc/en-us/requests/new).
