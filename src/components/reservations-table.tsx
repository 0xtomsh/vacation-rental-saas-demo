import { Fragment } from "react";
import {
  ArrowRight,
  ClipboardList,
  Save,
  Trash2,
} from "lucide-react";

export type Reservation = {
  id?: string;
  guest: string;
  property: string;
  dates: string;
  amount: string;
  status: string;
  statusValue?: string;
  propertyId?: string;
  guestId?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestCount?: number;
  totalAmount?: string;
  currency?: string;
  notes?: string | null;
};

type ReservationOption = {
  id: string;
  name: string;
};

type ReservationsTableProps = {
  reservations: Reservation[];
  guests?: ReservationOption[];
  properties?: ReservationOption[];
  actions?: {
    update: (id: string, formData: FormData) => Promise<void>;
    delete: (id: string) => Promise<void>;
  };
};

const statuses = [
  { value: "REVIEWING", label: "Reviewing" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PAYMENT_DUE", label: "Payment due" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "COMPLETED", label: "Completed" },
  { value: "NO_SHOW", label: "No show" },
];

function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]" htmlFor={htmlFor}>
      {children}
    </label>
  );
}

function inputClassName() {
  return "h-10 rounded-xl border border-[#e7e9f6] bg-white px-3 text-sm text-[#202238] outline-none focus:border-[#52dce6] focus:ring-3 focus:ring-[#52dce6]/20";
}

export function ReservationsTable({
  actions,
  guests = [],
  properties = [],
  reservations,
}: ReservationsTableProps) {
  const canEdit = Boolean(actions && guests.length > 0 && properties.length > 0);

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-[0_18px_44px_rgba(111,93,184,0.08)] ring-1 ring-[#eef0fb]">
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="flex items-center gap-2 font-semibold text-[#202238]">
          <ClipboardList aria-hidden="true" size={18} strokeWidth={2.2} />
          Recent reservations
        </h3>
        <a className="flex items-center gap-1.5 text-sm font-semibold text-[#6d61d7]" href="#">
          View all
          <ArrowRight aria-hidden="true" size={15} strokeWidth={2.2} />
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left text-sm">
          <thead className="bg-[#fafbff] text-[#8b91b5]">
            <tr>
              <th className="px-4 py-3 font-medium">Guest</th>
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Dates</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              {canEdit ? <th className="px-4 py-3 font-medium">Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => {
              const rowKey =
                reservation.id ?? `${reservation.guest}-${reservation.property}`;

              return (
              <Fragment key={rowKey}>
                <tr
                  className="border-t border-[#f0f2fb]"
                >
                  <td className="px-4 py-4 font-semibold text-[#202238]">{reservation.guest}</td>
                  <td className="px-4 py-4 text-[#74799b]">
                    {reservation.property}
                  </td>
                  <td className="px-4 py-4 text-[#74799b]">
                    {reservation.dates}
                  </td>
                  <td className="px-4 py-4 font-semibold text-[#202238]">{reservation.amount}</td>
                  <td className="px-4 py-4">
                    <span className="whitespace-nowrap rounded-full bg-[#effbfd] px-3 py-1 text-xs font-semibold text-[#28bac6]">
                      {reservation.status}
                    </span>
                  </td>
                  {canEdit && reservation.id ? (
                    <td className="px-4 py-4">
                      <form action={actions!.delete.bind(null, reservation.id)}>
                        <button
                          className="flex h-9 items-center justify-center gap-1.5 rounded-full border border-[#ffd5de] bg-white px-3 text-xs font-semibold text-[#df5473] hover:bg-[#fff6f8]"
                          type="submit"
                        >
                          <Trash2 aria-hidden="true" size={14} strokeWidth={2.2} />
                          Delete
                        </button>
                      </form>
                    </td>
                  ) : null}
                </tr>
                {canEdit && reservation.id ? (
                  <tr
                    className="border-t border-[#f0f2fb] bg-[#fbfcff]"
                  >
                    <td className="px-5 py-4" colSpan={6}>
                      <form
                        action={actions!.update.bind(null, reservation.id)}
                        className="grid gap-3 lg:grid-cols-[1fr_1fr_140px_140px_100px_130px_120px_auto]"
                      >
                        <FieldLabel htmlFor={`${reservation.id}-guest`}>
                          Guest
                          <select
                            className={inputClassName()}
                            defaultValue={reservation.guestId}
                            id={`${reservation.id}-guest`}
                            name="guestId"
                          >
                            {guests.map((guest) => (
                              <option key={guest.id} value={guest.id}>
                                {guest.name}
                              </option>
                            ))}
                          </select>
                        </FieldLabel>
                        <FieldLabel htmlFor={`${reservation.id}-property`}>
                          Property
                          <select
                            className={inputClassName()}
                            defaultValue={reservation.propertyId}
                            id={`${reservation.id}-property`}
                            name="propertyId"
                          >
                            {properties.map((property) => (
                              <option key={property.id} value={property.id}>
                                {property.name}
                              </option>
                            ))}
                          </select>
                        </FieldLabel>
                        <FieldLabel htmlFor={`${reservation.id}-check-in`}>
                          Check in
                          <input
                            className={inputClassName()}
                            defaultValue={reservation.checkInDate}
                            id={`${reservation.id}-check-in`}
                            name="checkInDate"
                            required
                            type="date"
                          />
                        </FieldLabel>
                        <FieldLabel htmlFor={`${reservation.id}-check-out`}>
                          Check out
                          <input
                            className={inputClassName()}
                            defaultValue={reservation.checkOutDate}
                            id={`${reservation.id}-check-out`}
                            name="checkOutDate"
                            required
                            type="date"
                          />
                        </FieldLabel>
                        <FieldLabel htmlFor={`${reservation.id}-guests`}>
                          Guests
                          <input
                            className={inputClassName()}
                            defaultValue={reservation.guestCount}
                            id={`${reservation.id}-guests`}
                            min="1"
                            name="guestCount"
                            required
                            type="number"
                          />
                        </FieldLabel>
                        <FieldLabel htmlFor={`${reservation.id}-amount`}>
                          Amount
                          <input
                            className={inputClassName()}
                            defaultValue={reservation.totalAmount}
                            id={`${reservation.id}-amount`}
                            min="0"
                            name="totalAmount"
                            required
                            step="0.01"
                            type="number"
                          />
                        </FieldLabel>
                        <FieldLabel htmlFor={`${reservation.id}-status`}>
                          Status
                          <select
                            className={inputClassName()}
                            defaultValue={reservation.statusValue ?? reservation.status}
                            id={`${reservation.id}-status`}
                            name="status"
                          >
                            {statuses.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </FieldLabel>
                        <input
                          defaultValue={reservation.currency ?? "USD"}
                          name="currency"
                          type="hidden"
                        />
                        <textarea
                          className="min-h-10 rounded-xl border border-[#e7e9f6] bg-white px-3 py-2 text-sm text-[#202238] outline-none focus:border-[#52dce6] focus:ring-3 focus:ring-[#52dce6]/20 lg:col-span-7"
                          defaultValue={reservation.notes ?? ""}
                          name="notes"
                          placeholder="Notes"
                        />
                        <button
                          className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#52dce6] px-4 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(82,220,230,0.28)] hover:bg-[#45cfd9]"
                          type="submit"
                        >
                          <Save aria-hidden="true" size={16} strokeWidth={2.2} />
                          Save
                        </button>
                      </form>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
              );
            })}
          </tbody>
        </table>
        {reservations.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-[#8b91b5]">
            No reservations yet.
          </div>
        ) : null}
      </div>
    </section>
  );
}
