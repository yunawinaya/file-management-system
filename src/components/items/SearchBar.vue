<template>
  <label class="relative block">
    <span class="sr-only">Search</span>
    <span class="absolute inset-y-0 left-0 flex items-center pl-2">
      <img
        src="@/assets/icons/search.svg"
        alt="search icon"
        class="h-5 w-5 brightness-50"
      />
    </span>
    <input
      class="placeholder:italic placeholder:text-slate-400 bg-white w-full border border-slate-400 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-slate-500 focus:ring-slate-500 focus:ring-1 sm:text-sm"
      placeholder="Search by file name or type"
      type="text"
      name="search"
    />
  </label>
</template>
