import { useProvider } from "../ContextProvider";
import { ChevronDown, ListFilter, Lock, Search, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../App.css";

export default function InstallationPage({ user, onLogout }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [connection, setConnection] = useState("all"); // all | online | offline
  const [state, setState] = useState("all"); // all | notifications | none
  const [onlyFavourites, setOnlyFavourites] = useState(false);
  const activeFilters =
    (query.trim() ? 1 : 0) +
    (connection !== "all" ? 1 : 0) +
    (state !== "all" ? 1 : 0) +
    (onlyFavourites ? 1 : 0);

  return (
    <>
      <Sidebar />
      <main className="main-content">
        <Topbar user={user} onLogout={onLogout} />
        <section className="inst-page">
          <div className="inst-head">
            <h2>Choose installation</h2>
            {/* {items && (
              <span className="inst-notif">
                Notifications
                <b
                  className={
                    totalNotifications ? "inst-badge" : "inst-badge zero"
                  }>
                  {totalNotifications}
                </b>
              </span>
            )} */}
          </div>

          <div className="inst-filters">
            <button
              type="button"
              className="inst-filters-bar"
              aria-expanded={filtersOpen}
              aria-controls="inst-filter-panel"
              onClick={() => setFiltersOpen((o) => !o)}>
              <ListFilter size={16} />
              Filters
              {activeFilters > 0 && (
                <b className="inst-badge info">{activeFilters}</b>
              )}
              <ChevronDown
                size={18}
                className={filtersOpen ? "inst-chevron open" : "inst-chevron"}
              />
            </button>
          </div>

          <ul className="inst-list">
            {/* {visible.map((item) => (
              <InstallationCard
                key={item.deviceid}
                item={item}
                favourite={favs.has(item.deviceid)}
                current={item.deviceid === user.deviceid}
                expanded={expanded === item.deviceid}
                onToggleFavourite={() => toggleFavourite(item.deviceid)}
                onToggleExpand={() =>
                  setExpanded((id) =>
                    id === item.deviceid ? null : item.deviceid,
                  )
                }
                onOpen={() => selectInstallation(item)}
              />
            ))} */}
          </ul>
        </section>
      </main>
    </>
  );
}
