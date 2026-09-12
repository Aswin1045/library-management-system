ALTER TABLE borrow_records ADD COLUMN due_date DATE;
UPDATE borrow_records SET due_date = DATE_ADD(borrow_date, INTERVAL 14 DAY);
