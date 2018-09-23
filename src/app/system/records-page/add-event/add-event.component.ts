import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import * as moment from 'moment';

import {Category} from '../../shared/models/category.model';
import {WFMEvent} from "../../shared/models/event.models";
import {EventService} from "../../shared/services/events.service";
import {BillService} from "../../shared/services/bill.service";
import {Bill} from "../../shared/models/bill.model";
import {Message} from "../../../shared/models/message.model";
import {Subscription} from "rxjs/Rx";

@Component({
    selector: 'qwerty-add-event',
    templateUrl: './add-event.component.html',
    styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit, OnDestroy {

    sub1: Subscription;
    sub2: Subscription;
    @Input() categories: Category[] = [];

    types = [
        {type: 'income', label: 'Доход'},
        {type: 'outcome', label: 'Расход'}
    ];

    message: Message;

    constructor(private eventsService: EventService, private billService: BillService) {
    }

    ngOnInit() {
        this.message = new Message('danger', '');
    }

    private showMessage(text: string) {
        this.message.text = text;
        window.setTimeout(() => this.message.text = '', 5000);
    }

    onSubmit(form: NgForm) {
        let {type, amount, category, description} = form.value;
        if (amount < 0) amount *= -1;

        const event = new WFMEvent(
            type, amount, +category, description,
            moment().format('DD.MM.YYYY HH:mm:ss')
        );

        this.sub1 = this.billService.getBill()
            .subscribe((bill: Bill) => {
                let value = 0;
                if (type === 'outcome') {
                    if (amount > bill.value) {
                        this.showMessage(`На счету не достаточно средств. Вам не хвататет ${amount - bill.value}`);
                        return;
                    } else {
                        value = bill.value - amount;
                    }
                } else {
                    value = bill.value + amount;
                }

                this.sub2 = this.billService.updateBill({value, currency: bill.currency})
                    .mergeMap(() => this.eventsService.addEvent(event))
                    .subscribe(() => {
                        form.setValue({
                            type: 'outcome',
                            amount: 0,
                            category: 1,
                            description: ' '
                        });
                    });

            });

        // this.eventsService.addEvent(event);

    }

    ngOnDestroy() {
        if (this.sub1) this.sub1.unsubscribe();
        if (this.sub2) this.sub2.unsubscribe();
    }

}
