/** @jsx React.DOM */

// the user is hardcoded for now
const USER_ID = 1;
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
      },
      favorites: {}
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
    this.loadFavorites();
    console.log('checking favs:', this.state.favorites);
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        var page = this.state.pagination.page;
        console.log('got data', data);
        $.ajax({
          url: '/favoriting/api/v1.0/' + USER_ID + '/' ,
          dataType: 'json',
          cache: false,
          success: function(favorites) {
            console.log('get favoriting data', favorites);

            var favorite_ids = favorites.favorites.map(function(obj){
              return obj.reddit_post_id
            });
            console.log('favorite_ids', favorite_ids);
            for (var i = 0; i < data.submissions.length; i++) {
              if (favorite_ids.indexOf(data.submissions[i].name) > -1) {
                console.log(data.submissions[i].name , 'is in favorite ids');
                data.submissions[i].favorite = true;
              }
              else {
                data.submissions[i].favorite = false;
              }
            }
            this.setState({
              entries: data.submissions,
              pagination: $.extend(this.state.pagination, {
                last_post_id: this.state.pagination.current_post_id,
                current_post_id: null,
                next_post_id: data.submissions[data.submissions.length-1].name
              })});
            console.log('set state done.');
            console.log('state set as', this.state);

          }.bind(this),
          error: function(xhr, status, err) {
            console.log(this.props.url, status, err.toString());
          }.bind(this)
        });

      }.bind(this),
      error: function(xhr, status, err) {
        console.log(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  loadFavorites: function() {
    $.ajax({
      url: '/favoriting/api/v1.0/' + USER_ID + '/' ,
      dataType: 'json',
      cache: false,
      success: function(data) {
        console.log('get favoriting data', data);
        this.setState({favorites: data.favorites});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    var entries = this.state.entries,
      that = this;
    console.log('this.state data:', this.state.entries, this.state.entries.length);
    if (!this.state.entries.length) {
      console.log('returning null');
      return null;
    }
    var on_favorite = function(entry, index, mouse_event) {
      console.log('on favvorite', entry, mouse_event, index);
      $.ajax({
        method: 'POST',
        url: '/favoriting/api/v1.0/' + USER_ID + '/' ,
        data: {
          url: entry.link,
          thumbnail: entry.thumbnail,
          reddit_post_id: entry.name
        },
        dataType: 'json',
        cache: false,
        success: function(data) {
          console.log('favorited success', data);
          console.log('in on favorite, state is', state.entries[index]);
          state.entries[index].favorite = true;
          // TODO: figure out binding of button disabling when favoriting a post
          that.setState({
              entries: $.extend(that.state.entries, {
                last_post_id: this.state.pagination.current_post_id,
                current_post_id: null,
                next_post_id: data.submissions[data.submissions.length-1].name
              })});

        }.bind(this),
        error: function(xhr, status, err) {
          console.log(this.props.url, status, err.toString());
        }.bind(this)
      });

    };
    return (
      <div className="pager">
        <ul>
          { entries.map(function (entry, index) {
            return <li>
                      <a href={entry.link}><img src={entry.thumbnail} alt={entry.title}/></a>
                      <Button text=" Add to favorites"
                              onClick={on_favorite.bind(this, entry, index)}
                              disabled={entry.favorite === true}/>
                   </li>
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
  render: function() {
    return (
      <button type="button" onClick={this.props.onClick}
              disabled={this.props.disabled}>{this.props.text}</button>
    );
  }
});


var SimpleRedditClient = React.createClass({
  getInitialState: function() {
    return {
      is_home: true
    };
  },
  onClickHome: function() {
    this.setState({ is_home: true });
  },
  onClickFav: function() {
    this.setState({ is_home: false });
  },
  render: function() {
    var favorites_url = "/favoriting/api/v1.0/" + USER_ID + "/",
      reddit_all = "reddit/api/v1.0/all/";

    return (
    <div>
      <Button text="Home" disabled={this.state.is_home} onClick={this.onClickHome}></Button>
      <Button text="Favorites" disabled={!this.state.is_home} onClick={this.onClickFav}></Button>
      { this.state.is_home ?
        <RedditEntries url={reddit_all}/> : <RedditFavorites url={favorites_url} /> }
    </div>
    )
  }
});

var RedditFavorites = React.createClass({
  render: function() {
    return null;
  }
});

React.render(
  <SimpleRedditClient/>,
  document.getElementById('entries-list')
);