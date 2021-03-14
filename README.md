# AdapTable OpenFin Demo

<img src="./images/demo.PNG" />

## Overview

This demo application illustrates how [Adaptable](https://adaptabletools.com) and [OpenFin](https://openfin.co/) combine neatly together to offer powerful, cutting-edge, functionality that can be used to create feature-rich financial applications.

It uses **dummy data** to mimic the types of screens, workflows and advanced use-cases typically found in Financial Services systems.

> The demo application is not designed to be used 'off the shelf' but as an example of the functionality offered by AdapTable and OpenFin, and how they can be used in tandem to produce cutting-edge applications with advanced features like live 2-way excel exports, notifications, cross-widget communication and many other benefits.

The demo took just 2 days to develop and uses just a small subset of the many, exceptional features found in both AdapTable and OpenFin.  

In particular it demonstrates 3 areas where AdapTable and OpenFin functionality combine in exciting ways:

- [Notifications](#notifications-and-alerts) - AdapTable's powerful Alerts can be shown as OpenFin Notifications with action buttons
- [FDC3 Messages](#application-bar) - FDC3 broadcasts can be sent from AdapTable to other OpenFin windows via current channel (and internally through the IAB message bus)
- [Live 2-way Excel Integration](#live-export) - Ticking data can be sent from AdapTable to Excel and each updates in line with data changes made in the other, including full validation.
## How it Works

The demo - built using AdapTable's [OpenFin Plugin](https://docs.adaptabletools.com/docs/plugins/openfin/openfin-plugin) - displays a pseudo Front Office set-up with 3 views: _Trade_, _Price_ & _Positions_.

Each blotter is an OpenFin application which shows 'ticking' data, and each updates in real time as a result of external ticking data updates and data changes made in the other screens.

The demo also includes 2 Audit windows - Trade and Price - which show all the grid-related activity in the respective blotters.

> All 5 screens are OpenFin windows built using the [OpenFin Platform API](https://developers.openfin.co/docs/platform-api) including grouped, tabbed and windowed layouts, saving and applying custom snapshots, tear-outs and window customization.

### Blotters

The 3 blotters in the demo application are:

**1. Trade Blotter**

- Displays a collection of fictitous Trades (25 at startup), each of which has an _InstrumentId_ and a _Status_ (of active or inactive)
- Every 10 seconds a new trade is added to the dummy data and displayed in the Grid
- Editable columns are: _Status_ and _Notional_

**2. Price Blotter**

- Displays a made-up list of _Instruments_, each of which contains a Price
- Every few seconds the Price is updated (and flashes accordingly)
- Each row also contains a _Closing Price_, _Spread_ and _Bid_ and _Ask_
- Editable columns are: _Price_, _BidOfferSpread_

**3. Positions Blotter**

- Displays the position for each _InstrumentId_ based on data from the Trade and Price screens
- Each row aggregates all the trades for an <i>InstrumentId</i> and calculates the PnL based on the current Price
- Each time a Trade is added or a Price changes, the Positions Blotter will update (via the OpenFin xxx)
- No columns are editable

### Application Bar

At the top of the demo are a series of useful buttons and dropdowns which help to manage, and sync data between, the various windows. 

<img src="https://github.com/AdaptableTools/openfin-demo/raw/master/images/toolbar.gif" />

The Application Bar contains: 

- **Channel Chooser** - allows the user to pick the (coloured) [OpenFin Channel](https://developers.openfin.co/docs/channels) on which FDC3 messages will be broadcast

- **Instrument Picker**: Selecting an Instrument from the dropdown does 2 things:

  1. broadcasts an [FDC3](https://fdc3.finos.org/) message on the current channel providing details of the selected instrument; this allows 3rd party applications running in OpenFin to react accordingly
  2. sends a message via the [OpenFin IAB](https://developers.openfin.co/docs/introduction) (Inter-Application Message Bus); this is intercepted by each of the 3 blotters which then filter to show only rows containing that Instrument

- **Theme Button** - toggles the [Adaptable Theme](https://docs.adaptabletools.com/docs/adaptable-functions/theme-function) in all the Blotters between white and dark themes.

  > The same effect can be achieved by changing the theme in any of the individual Blotters

- **Pause/Display Button** - sets whether OpenFin Notifications wil appear

- **Hide/Show Butto** - toggles Sidebar visibility



### Audit Screens

The Demo leverages the powerful [AdapTable Audit Log](https://docs.adaptabletools.com/docs/key-topics/audit-log) to provide a live 'view' of all data changes.

There are 2 Audit Screens - each of which listens to the Audit Log stream and outputs the data directly to an AdapTable instance:

- **Trade Audit**: Displays a list of all Cell Edits made in the Trade Blotter - who made the change, what was changed and when
- **Price Blotter**: Displays a list of all Cell Edits made in the Price Blotter and also logs all Ticking Data changes

<img src="./images/priceaudit.PNG" />

### Sidebar

A sidebar is displayed on the left of the application giving access to all the screens available in the demo

> This can be hidden / displayed via a button in the Application Toolbar

## Notifications and Alerts

The Positions Blotter has been set up to fire an [Adaptable Alert](https://docs.adaptabletools.com/docs/adaptable-functions/alert-function) when any Position is greater than 70,000.

We have set the _showAdaptableAlertsAsNotifications_ property in OpenFinPluginOpetions to true.  The result is that, when triggered, Alerts are displayed as an [OpenFin Notification](https://www.npmjs.com/package/openfin-notifications) and appear at the side of the grid.

The Alert has been configured with 2 butttons:

- **Show Me**: uses the 'highlight-cell' and 'jump-to-cell' [Predefined Actions](https://docs.adaptabletools.com/docs/adaptable-functions/alert-function#predefined-actions) to let the user see the Cell that triggered the Alert.
- **Increase Limit**: sets a [Custom User Function](https://docs.adaptabletools.com/docs/adaptable-functions/alert-function#custom-user-function) to add 1,000 to the Position amount that, when exceeded, triggeres the Alert.

  > After this button is clicked, the next time the Alert fires it shows the updated limit as its trigger.

Both of the AdapTable Alert buttons automatically convert into [OpenFin action buttons](https://cdn.openfin.co/docs/services/notifications/stable/api/modules/actions.html) with 'cta' displaying based on the Button's style. 

<img src="./images/notification.PNG" />

## FDC3 Broadcasts

In all 3 views the 'Instrument' column has been configued (using the [Finance Plugin](https://docs.adaptabletools.com/docs/plugins/finance/finance-plugin)) as of type **InstrumentColumn**.

As a result a *Broadcast Instrument* [Context Menu item](https://docs.adaptabletools.com/docs/user-interface/context-menu) is automatically added to each Column's Context Menu.

When that menu item is clicked, Adaptable (when running in OpenFin) listens to the [Broadcast Instrument event](https://docs.adaptabletools.com/docs/plugins/finance/finance-plugin#broadcast-instrument) and broadcasts an FDC3 message on the current channel containing the [Instrument Context](https://fdc3.finos.org/docs/1.0/context-spec).


## Live Export

AdapTable ships with many compelling, extra features, only available when it is running in the OpenFin container.

One of these is 2-way Live Export - whereby grid data can be sent from AdapTable to Excel with the following features:

<img src="https://github.com/AdaptableTools/openfin-demo/raw/master/images/openfintoolbar.gif" />

- Excel will automatically update in line with cell edits and ticking data changes in AdapTable

- Any date edits made directly in Excel will be automatically reflected in AdapTable
- Any [Cell Validation Rules](https://docs.adaptabletools.com/docs/adaptable-functions/cell-validation-function) created in AdapTable will be invoked when data in Excel is edited which breaks a rule.

  > When that happens an OpenFin Notification will popup giving details of the validation rule and an Action Button to undo the edit

  <img src="./images/validationerror.PNG" />

This is activated by selecting a report from the **OpenFin Toolbar** in the Trades [Dashboard](https://docs.adaptabletools.com/docs/user-interface/dashboard) and running Live Update (the play buttton).

> Note: you must have Excel open **before** you run Live Export

<img src="./images/liveexcel.PNG" />


## AdapTable Features

There are numerous [AdapTable Functions](https://docs.adaptabletools.com/docs/adaptable-functions/adaptable-functions-overview) being used in this demo to enhance the workflow and improve the user experience.

> For this demo, these have been configured as JSON at design-time through [Predefined Config](https://docs.adaptabletools.com/docs/predefined-config/predefined-config-overview), but they can, instead, be created at run-time via the AdapTable UI (or programmatically through the [Adaptable API](https://docs.adaptabletools.com/docs/adaptable-api/adaptable-api-overview)).

The AdapTable Functions being used in this demo include:

### Dashboard

The AdapTable [Dashboard](https://docs.adaptabletools.com/docs/user-interface/dashboard) has been set up as follows in the various blotters:

- _Trades View_ - has 2 Tabs - _Blotter_ and _Reports_ (each with own set of Toolbars)
- _Position View_ & _Price View_ - a single Tab with a different set of Toolbars
- _Position View_ & _Price View_ - configued so Dashboard is in 'Collapsed' mode at startup

### Layout

There are a number of Layouts configured for the demo:

- _Trades View_ contains 2 [Layouts](https://docs.adaptabletools.com/docs/adaptable-functions/layout-function) :

  1. _Latest Trades_ - shows all Columns ordered by _TradeId_ in descending order
  2. _Counterparties_ - shows a subset of Columns grouped by _Counterparty_ (and with _Notional_ aggregated)

- _Price View_ contains a single Layout called Price - this includes all 3 [Calculated Columns](https://docs.adaptabletools.com/docs/adaptable-functions/calculated-column-function) created for that view.

### Alert

An [Alert](https://docs.adaptabletools.com/docs/adaptable-functions/alert-function) (of type 'Warning') has been configured in _Position View_ to fire when Position Coumn value > 70,000 - will trigger an OpenFin Notification

### Conditional Style

The following [Conditional Styles](https://docs.adaptabletools.com/docs/adaptable-functions/conditional-style-function) have been set up:

- _Trades View_ - Styles the whole Row light yellow where _Status_ column value is 'active'
- _Price View_ - 2 Styles for 'Change of Day' column: green background for positive values and red background for negative values
- _Position View_ - 'PnL' column displays a green / red font for positive / negative numbers

### Calculated Column

3 [Calculated Columns](https://docs.adaptabletools.com/docs/adaptable-functions/calculated-column-function) have been configured in _Price View_:

- **Bid**: Created with Expression: `'[price] - [bidOfferSpread] / 2'`
- **Ask**: Created with Expression: `'[price] + [bidOfferSpread] / 2' `
- **Change on Day**: Created with Expression: `'[price] - [closingPrice]'`

### Format Column

All the views have [Format Columns](https://docs.adaptabletools.com/docs/adaptable-functions/format-column-function) configured:

- _Trades View_: All Date Columns (Trade Date, Settlement Date, LastUpdated) use a Date Format of 'MM/DD/YYYY'
- _Price View_: 'Bid', 'Ask', 'Change On Day', 'Price' have Display Format of 4 dp and right cell alignment
- _Position View_: 'Current Price', 'Closing Price' have Display Format of 4 dp; 'PnL' has negative numbers in parentheses

### Gradient Column

The _Notional_ column in _Trades View_ has a [Gradient Column](https://docs.adaptabletools.com/docs/adaptable-functions/gradient-column-function) applied using a light green background.

### Flashing Cell

These [Flashing Cell](https://docs.adaptabletools.com/docs/adaptable-functions/flashing-cell-function) columns have been configured:

- _Price View_: 'Bid', 'Ask', and 'Price' all have Flashing Cells set (to Green and Red)
- _Position View_: 'Position' has Flashing Cells set (to Green and Red)

### Plus Minus

_Price View_ contains 2 [Plus / Minus Rules](https://docs.adaptabletools.com/docs/adaptable-functions/plus-minus-function) for the 'Bid Offer Spread' column:

- Default Nudge value of 0.5 - how cells in Column will increment / decrement when the '+' or '-' keys are pressed
- A Custom Plus Minus Rule which specifies that if the _InstrumentId_ is 'AAPL', the cell will nudge instead by 1

### Export

_Trades View_ contains an 'Active Trades' Report for [Export](https://docs.adaptabletools.com/docs/adaptable-functions/export-function) which;

- includes All Columns and any Rows where Status is 'Active'
- is also available in the OpenFin Toolbar and so can be exported to Excel as a "Live Report (which will update in real time)

### Cell Validation

A [Cell Validation Rule](https://docs.adaptabletools.com/docs/adaptable-functions/cell-validation-function) has been added to the _Trades_ view that the 'Notional' column cannot be negative.

### EditLookUp

An [Edit Lookup](https://docs.adaptabletools.com/docs/predefined-config/user-interface-config#editlookupitems) Item has been added to _Status_ column in _Trades View_ to enable quick editing

### Query

A [Shared Query](https://docs.adaptabletools.com/docs/adaptable-functions/query-function) called "Active US Trades" has been supplied for _Trades View_ to show active to show active trades for some counterparties. The Expression it uses is:

```
'[status]="active" AND [counterparty] IN ("Goldman Sachs","Bank of America","JP Morgan","Morgan Stanley")'
```

### Action Column

An [Action Column](https://docs.adaptabletools.com/docs/adaptable-functions/action-column-function) has been added to the _Trades View_ which displays a 'Cancel' button in any row where Status is 'active'. When clicked it changes the Status to 'inactive'.

### User Menu Items

The _Trades View_ has a _Cancel_ Context Menu Item which appears in all rows where _Status_ is 'active'. When the menu item is selected the _Status_ changes to 'inactive'.

## Installation

NOTE: In order to be able to run `npm install`, you need first to be logged into our private NPM registry - follow the instructions in the [Adaptable Documentation](https://docs.adaptabletools.com/docs/getting-started/installationn)

> If you do not have an Adpatable Login please contact support@adaptabletools.com

Run `npm install` (or `yarn`), depending on what tool you're using.

## Running in production

If you want to run the live app just run the command below on a Windows machine

```sh
$ npx openfin-cli --launch --config https://openfin-demo.adaptabletools.com/openfin-app.json
```

This will launch the OpenFin runtime and open the AdapTable demo for you.

### Running in dev

To run the demo in development mode run these 2 commands:

```sh
$  npm run dev
$  npm run dev-openfin
```

## Licences

A licence for AdapTable provides access to all product features as well as quarterly updates and enhancements through the lifetime of the licence, comprehensive support, and access to all 3rd party libraries.

Licences can be purchased individually, for a team, for an organisation or for integration into software for onward sale.

We can make a trial licence available for a short period of time to allow you to try out AdapTable for yourself.

Please contact [`sales@adaptabletools.com`](mailto:sales@adaptabletools.com) for more information.

## More Information

- For general information about Adaptable Tools is available at our [Website](http://www.adaptabletools.com)

- To see AdapTable in action visit our [Demo Site](https://demo.adaptabletools.com) which contains large number of AdapTable demos each showing a different feature, function or option in AdapTable (using dummy data sets).

- Developers can learn how to access AdapTable programmatically at [AdapTable Documentation](https://docs.adaptabletools.com).

- For all support enquiries please email [`support@adaptabletools.com`](mailto:support@adaptabletools.com) or [raise a Support Ticket](https://adaptabletools.zendesk.com/hc/en-us/requests/new).
