/** @jsx React.DOM */

const ENTRIES_PER_PAGE = 25;

// handles actually outputing current list of entries from reddit
var RedditEntries = React.createClass({
  // sets initial state
  getInitialState: function() {
    return {
      entries: [],
      pagination: {
        page: 0,
        entries_per_page: ENTRIES_PER_PAGE,
        last_post_id: null,
        current_post_id: null,
        next_post_id: null
      }
    };
  },
  getFirstPage: function() {
    this.setState({pagination: $.extend(this.state.pagination, {
      page: 0,
      last_post_id: null,
      current_post_id: null,
      next_post_id: null})});
    this.loadEntries.call(this);
  },
  getNextPage: function() {
    var page = this.state.pagination.page;
    this.setState({pagination: $.extend(this.state.pagination, {
      page: page + 1,
      current_post_id: this.state.pagination.next_post_id})});
    this.loadEntries.call(this);
  },
  getPrevPage: function() {
    var page = this.state.pagination.page;
    this.setState({pagination: $.extend(this.state.pagination, {
      page: page - 1,
      current_post_id: this.state.pagination.last_post_id})});
    this.loadEntries.call(this);
  },

  componentDidMount: function() {
    this.loadEntries();
  },
  loadEntries: function() {
    var after_name = this.state.pagination.page === 0 ? null:this.state.pagination.current_post_id;
    var url = this.props.url + '?number_of_entries=' + this.state.pagination.entries_per_page +
      '&after_name=' + after_name;
    console.log('loading entries', this.state.pagination, 'url as: ', url);
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        var page = this.state.pagination.page;
        console.log('got data', data);
        this.setState({
          entries: data.submissions,
          pagination: $.extend(this.state.pagination, {
            last_post_id: this.state.pagination.current_post_id,
            current_post_id: null,
            next_post_id: data.submissions[data.submissions.length-1].name
          })});
        console.log('set state done.');
        console.log('state set as', this.state.pagination);

      }.bind(this),
      error: function(xhr, status, err) {
        console.log(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    var entries = this.state.entries;
    console.log('this.state data:', this.state.entries, this.state.entries.length);
    if (!this.state.entries.length) {
      console.log('returning null');
      return null;
    }

    return (
      <div className="pager">
        <ul>
          { entries.map(function (entry) {
            return <li><a href={entry.link}><img src={entry.thumbnail} alt={entry.title}/></a></li>
          })}
        </ul>
        <Footer data={this.state} onFirst={this.getFirstPage} onPrev={this.getPrevPage}
                onNext={this.getNextPage} />
      </div>
    );

  }
});

var Footer = React.createClass({
  render: function() {
    return (
      <div className="footer">
        <div className="pagination-control">
          <Button text="<< First" onClick={this.props.onFirst}
                  disabled={this.props.data.pagination.page === 0} />
          <Button text="< Prev" onClick={this.props.onPrev}
                  disabled={this.props.data.pagination.page === 0} />
          <Button text="Next >" onClick={this.props.onNext} />
        </div>

        <div className="stats">
          <span className="">Page {this.props.data.pagination.page + 1} </span>
        </div>
      </div>
    );
  }
});

// from http://zinoui.com/blog/react-grid-component
var Button = React.createClass({
  render: function () {
    return (
      <button type="button" onClick={this.props.onClick}
              disabled={this.props.disabled}>{this.props.text}</button>
    );
  }
});

React.render(
  <RedditEntries url="reddit/api/v1.0/all/"/>,
  document.getElementById('entries-list')
);