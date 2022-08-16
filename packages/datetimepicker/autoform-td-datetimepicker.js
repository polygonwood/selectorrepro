// import { Template } from 'meteor/template';
import { DateTime, Settings } from 'luxon';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Random } from 'meteor/random';

import './autoform-td-datetimepicker.html';

AutoForm.addInputType("tempusdominus", {
    template: "afTempusDominusDateTimePicker",
    // valueIn: function (val, atts) {
    //   // datetimepicker expects the date to represent local time,
    //   // so we need to adjust it if there's a timezoneId specified
    //   var timezoneId = atts.timezoneId;
    //   if (typeof timezoneId === "string") {
    //     if (typeof moment.tz !== "function") {
    //       throw new Error("If you specify a timezoneId, make sure that you've added a moment-timezone package to your app");
    //     }
    //     if (val instanceof Date) {
    //       return moment(AutoForm.Utility.dateToNormalizedLocalDateAndTimeString(val, timezoneId), "YYYY-MM-DD[T]HH:mm:ss.SSS").toDate();
    //     }
    //   }
    //   console.log('val:' + val);
    //   return DateTime.fromJSDate(val).toFormat("dd/mm/yyyy");
    // },
    valueOut: function () {
        // todo multiple dates selection
        // console.log('value out',this);
        // console.log(`valueOut ${this.val()} ${typeof (this.val())}`);
        let id = this[0].dataset['picker'];
        let picker = global.pickers[id];
        console.log('picker is',picker.dates.lastPicked);
        if (picker.dates.lastPicked) return DateTime.fromJSDate(picker.dates.lastPicked).toJSDate();
        else return undefined;
    },
    // valueConverters: {
    //   "string": function (val) {
    //     return (val instanceof Date) ? val.toString() : val;
    //   },
    //   "stringArray": function (val) {
    //     if (val instanceof Date) {
    //       return [val.toString()];
    //     }
    //     return val;
    //   },
    //   "number": function (val) {
    //     return (val instanceof Date) ? val.getTime() : val;
    //   },
    //   "numberArray": function (val) {
    //     if (val instanceof Date) {
    //       return [val.getTime()];
    //     }
    //     return val;
    //   },
    //   "dateArray": function (val) {
    //     if (val instanceof Date) {
    //       return [val];
    //     }
    //     return val;
    //   }
    // },
    // contextAdjust: function (context) {
    //   if (context.atts.timezoneId) {
    //     context.atts["data-timezone-id"] = context.atts.timezoneId;
    //   }
    //   delete context.atts.timezoneId;
    //   return context;
    // }
});

Template.afTempusDominusDateTimePicker.helpers({
    pickerId() {
        return Template.instance().pickerId.get()
    },
    atts: function addFormControlAtts() {
        var atts = _.clone(this.atts);
        // Add bootstrap class
        atts = AutoForm.Utility.addClass(atts, "form-control");
        if (atts.dateTimePickerOptions) delete atts.dateTimePickerOptions;
        if (atts.locale) delete atts.locale;
        // console.log('atts', atts);

        if (!atts.manualInput) {
            atts['readonly'] = "";
            delete atts.manualInput;
        }
        else if ('readonly' in atts) delete atts.readonly;
        // console.log('picker?',Template.instance().pickerId);
        // if (Template.instance().pickerId && Template.instance().pickerId.get()) atts['data-picker'] = global.pickers[Template.instance().pickerId.get()];
        atts['data-picker'] = Template.instance().pickerId.get();
        // console.log('atts', atts);
        return atts;
    }
});

Template.afTempusDominusDateTimePicker.onCreated(function afTempusDominusDateTimePickerOnCreated() {
    this.pickerId = new ReactiveVar(Random.id());
})

Template.afTempusDominusDateTimePicker.onRendered(function afTempusDominusDateTimePickerOnRendered() {
    // let $input = this.$(`#${this.pickerId.get()}`)[0];
    let $input = document.getElementById(this.pickerId.get());
    // console.log('tempus', $input, TempusDominus);
    let data = this.data;
    let opts = data.atts.dateTimePickerOptions || {};
    // $input.picker = this.picker;
    
    let locale;
    if (data.atts.locale && (typeof (data.atts.locale) == 'function')) {
        locale = data.atts.locale();
    }
    else {
        locale = data.atts.locale ? ((data.atts.locale == 'en') ? 'default' : data.atts.locale) : 'default';
    }
    TempusDominus.locale(locale);
    // first set locale right before creating picker !
    this.picker = new TempusDominus.TempusDominus($input, opts);
    global.pickers[this.pickerId.get()] = this.picker;
    this.picker.locale(locale);
    console.log('picker',locale, data, opts);

    // if value passed
    let parsedDate = this.picker.dates.parseInput(new DateTime.local().toJSDate());
    if (data.value) parsedDate = this.picker.dates.parseInput(data.value);
    else if (opts.defaultDate) parsedDate = this.picker.dates.parseInput(opts.defaultDate);
    else if (opts.useCurrent) parsedDate = this.picker.dates.parseInput(new DateTime.local().startOf('minute').toJSDate());
    parsedDate.setLocale(locale);
    // console.log('parsed date',parsedDate);
    this.picker.dates.setValue(parsedDate);

    if ('readonly' in data.atts) {
        this.picker.disable();
        console.log('picker disabled');
    }
    const subscription = this.picker.subscribe(TempusDominus.Namespace.events.change, (e) => {
        console.log(e, e.date, typeof (e.date));
    });

    // set and reactively update values (updates from autoform, e.g. from custom validation)
    this.autorun(() => {
        let data = Template.currentData();
        // var dtp = $input.data("DateTimePicker");
        // set field value
        console.log(data);
        if (!Tracker.currentComputation.firstRun) {
            if (data.value instanceof Date) {
                const parsedDate = this.picker.dates.parseInput(date.value);
                parsedDate.setLocale(locale);
                this.picker.dates.setValue(parsedDate);
                console.log('autorun change of picker value', parsedDate);
                // dtp.date(data.value);
            } else {
                // dtp.date(); // clear
                // this.picker.dates.clear();
                this.picker.dates.setValue(parsedDate);
                console.log('autorun clear of picker value',data.value);
            }
        }
        // set start/end date if there's a min/max in the schema
        //not required since this is provided by the options
        // if (data.min instanceof Date) {
        //     dtp.setMinDate(data.min);
        // }

        // if (data.max instanceof Date) {
        //     dtp.setMaxDate(data.max);
        // }
    });
    return;

    // To be able to properly detect a cleared field, the defaultDate,
    // which is "" by default, must be null instead. Otherwise we get
    // the current datetime when we call getDate() on an empty field.
    if (!opts.defaultDate || opts.defaultDate === "") {
        opts.defaultDate = null;
    }
});

Template.afTempusDominusDateTimePicker.onDestroyed(function afTempusDominusDateTimePickerOnDestroyed() {
    if (this.picker) {
        this.picker.dispose();
        delete global[this.pickerId.get()];
    }
});